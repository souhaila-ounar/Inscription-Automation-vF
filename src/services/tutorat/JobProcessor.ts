import { generateJobInfo } from "../../utils/tutorat/generateJobInfo";
import { getRatesFromFormData } from "../../utils/tutorat/getRates";
import { formatSubjects } from "../../utils/tutorat/formatSubjects";
import { createJob, assignskillToService } from "../serviceService";
import { getFormattedTeachingSkills } from "../../utils/tutorat/mapTeachingSkillsToAPI";
import { sendJobToAutomations } from "../../utils/common/sendAutomationRequest";
import {
  enqueueFallbackJob,
  enqueueFollowupSteps,
} from "../../utils/common/queue.utils";
import { fallbackQueue } from "../../queues/fallbackQueue";
import { followupQueue } from "../../queues/followupQueue";

export class JobProcessor {
  constructor(
    private formData: Record<string, any>,
    private branchId: number,
    private clientId: number,
    private studentId: number,
    private clientAdresse: string,
    private clientCity: string
  ) {}

  async createAllJobs() {
    console.log("from creatAlljobs");
    const jobs = [];
    const mainJob = await this.createAndHandleJob(false);
    jobs.push(mainJob);

    const creation2emmandat = this.formData?.Cr_er_une_2e_demande;
    if (
      typeof creation2emmandat === "string" &&
      creation2emmandat.trim() !== ""
    ) {
      console.log("mandats2");
      const secondJob = await this.createAndHandleJob(true);
      jobs.push(secondJob);
    }

    return jobs;
  }

  async createAndHandleJob(isSecond = false) {
    const { subjects, exactNiveau } = formatSubjects({
      formData: this.formData,
      isSecondMandate: isSecond,
    });

    const { location, chargeRate, tutorRate } = getRatesFromFormData(
      this.formData
    );

    const jobPayload = await generateJobInfo({
      formData: this.formData,
      subjects,
      niveauExact: exactNiveau || "",
      location,
      clientVille: this.clientCity,
      clientAdresse: this.clientAdresse,
      studentId: this.studentId,
    });

    jobPayload.dft_charge_rate = chargeRate;
    jobPayload.dft_contractor_rate = tutorRate;

    const createdJob = await this.processJob(
      jobPayload,
      subjects,
      exactNiveau || ""
    );
    await this.handleQueues(createdJob.id, location);

    return createdJob;
  }

  private async processJob(
    jobPayload: any,
    subjects: string[],
    exactNiveau: string
  ) {
    const createdJob = await createJob(this.branchId, jobPayload);
    await sendJobToAutomations(createdJob, this.studentId, this.clientId);

    const teachingSkills = getFormattedTeachingSkills(
      subjects.join(", "),
      exactNiveau
    );
    const validSkills = teachingSkills.subjects.filter(
      (s) => s.subject !== null
    );

    await Promise.all(
      validSkills.map((skill) =>
        assignskillToService(this.branchId, {
          service: createdJob.id,
          priority: "required",
          qual_level: teachingSkills.qual_level,
          subject_category: 60,
          subject: skill.subject,
        })
      )
    );

    return createdJob;
  }

  private async handleQueues(jobId: number, location: string) {
    const accepted = this.formData.accepte?.includes("accepte");
    const refused = this.formData.accepte?.includes("refuse");

    if (location === "enPresentiel") {
      if (accepted) {
        await enqueueFallbackJob({
          queue: fallbackQueue,
          jobId,
          studentId: this.studentId,
          clientId: this.clientId,
          branchId: this.branchId,
          formData: this.formData,
          delayInMs: 7 * 24 * 60 * 60 * 1000,
        });
      }
      if (refused) {
        await enqueueFollowupSteps({
          queue: followupQueue,
          jobId,
          clientId: this.clientId,
          branchId: this.branchId,
          formData: this.formData,
        });
      }
    }
  }
}
