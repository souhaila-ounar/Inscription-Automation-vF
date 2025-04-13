import { getRatesFromFormData } from "../../utils/tutorat/getRates";
import { generateJobInfo } from "../../utils/tutorat/generateJobInfo";
import { SMTPMailClient } from "../../clients/smtp-mail.client";
import { getFormattedDateTimeCanada } from "../../utils/common/date.utils";
import {
  getJobInfo,
  updateJobInfo,
  createJob,
  assignskillToService,
} from "../serviceService";
import { formatSubjects } from "../../utils/tutorat/formatSubjects";
import { sendJobToAutomations } from "../../utils/common/sendAutomationRequest";
import { getClient } from "../clientStudentService";
import { generateFallBackEmailContent } from "../../utils/common/emails/generateFallBackEmailContent";
import { SupabaseClient } from "../../clients/supabase.client";
import { AsanaClient } from "../../clients/asana.client";
import { formatAgentName } from "../../utils/common/formatAgentName";

export class JobFallbackHandler {
  constructor(
    private smtpClient = new SMTPMailClient(),
    private supabase = new SupabaseClient("tutorax"),
    private asana = new AsanaClient()
  ) {}

  public async handleFallback(data: {
    jobId: number;
    clientId: number;
    studentId: number;
    branchId: number;
    formData: Record<string, any>;
  }) {
    console.log("Fallback handler initiated!");

    const { jobId, branchId, studentId, clientId, formData } = data;
    const job = await getJobInfo(branchId, jobId.toString());

    if (!this.shouldFallback(job)) return;

    await this.closeOldJob(branchId, job);
    const newJob = await this.createOnlineJob(
      job,
      formData,
      branchId,
      studentId
    );
    await this.reassignSkills(job, branchId, newJob.id);
    await this.notifyClient(
      formData,
      clientId,
      branchId,
      newJob,
      formData.title
    );
    await this.updateAgentTask(job, newJob.name);
  }

  private shouldFallback(job: any): boolean {
    const isAvailable = job.status === "available";
    const shouldSwitch =
      job.extra_attrs.find(
        (attr: any) => attr.machine_name === "switch_to_online_after_7_days"
      )?.value === "True";
    return isAvailable && shouldSwitch;
  }

  private async closeOldJob(branchId: number, job: any): Promise<void> {
    const oldNote =
      job.extra_attrs.find((attr: any) => attr.machine_name === "note")
        ?.value || "";
    const dateFr = getFormattedDateTimeCanada("fr");

    const newNote = `Le ${dateFr}, ce mandat a été fermé automatiquement après 7 jours sans tuteur assigné. Le client ayant accepté de passer en ligne, une nouvelle demande a été créée.\n\n${oldNote}`;

    await updateJobInfo(
      branchId,
      {
        id: job.id,
        name: job.name,
        dft_charge_rate: job.dft_charge_rate,
        dft_contractor_rate: job.dft_contractor_rate,
        colour: "#ff0000",
        status: "finished",
        extra_attrs: { note: newNote },
      },
      job.id
    );
  }

  private async createOnlineJob(
    job: any,
    formData: any,
    branchId: number,
    studentId: number
  ) {
    const updatedForm = { ...formData, location: "enLigne" };
    const { chargeRate, tutorRate } = getRatesFromFormData(updatedForm);
    const { subjects, exactNiveau } = formatSubjects({ formData: updatedForm });

    const jobPayload = await generateJobInfo({
      formData: updatedForm,
      subjects,
      niveauExact: exactNiveau || "",
      location: "enLigne",
      studentId,
    });

    const dateFr = getFormattedDateTimeCanada("fr");
    const tutorNotes = this.buildTutorNotes(formData);

    jobPayload.extra_attrs.note = `Mandat créé automatiquement le ${dateFr} car le client attend depuis 7 jours d'avoir un tuteur en présentiel et a accepté de passer en ligne.\n${tutorNotes}`;
    jobPayload.extra_attrs.switch_to_online_after_7_days = "false";
    jobPayload.dft_charge_rate = chargeRate;
    jobPayload.dft_contractor_rate = tutorRate;

    const newJob = await createJob(branchId, jobPayload);
    await sendJobToAutomations(newJob, studentId, formData.clientId, job);

    return newJob;
  }

  private buildTutorNotes(formData: any): string {
    let notes = `Préférence du client - Genre du tuteur : ${
      formData.genre_tuteur || "Non spécifié"
    }`;

    if (formData.tutor_requirements === "true") {
      const exigences =
        Array.isArray(formData.exigences_tuteur) &&
        formData.exigences_tuteur.length > 0
          ? formData.exigences_tuteur.join(", ")
          : "Aucune exigence précisée.";

      notes += `\nExigence du client pour le tuteur : ${exigences}\n${
        formData?.notes_de_gestion_mandat_tutorat || ""
      }`;
    }

    return notes;
  }

  private async reassignSkills(
    job: any,
    branchId: number,
    newJobId: number
  ): Promise<void> {
    for (const skill of job.desired_skills || []) {
      await assignskillToService(branchId, {
        service: newJobId,
        subject: skill.subject.id,
        qual_level: skill.qual_level.id,
        priority: "required",
        subject_category: skill.subject_category.id,
      });
    }
  }

  private async notifyClient(
    formData: any,
    clientId: number,
    branchId: number,
    job: any,
    title: string
  ) {
    const clientData = await getClient(branchId, clientId.toString());
    const admin = clientData?.associated_admin;

    const fromName = admin
      ? `${admin.first_name} ${admin.last_name}`
      : "Tutorax";
    const fromEmail = admin?.email || "contact@tutorax.com";
    const isFeminine = title?.toLowerCase() === "madame";
    const clientFirstName = formData.nom_parent.first_name;

    const { subjects } = formatSubjects({ formData });
    const body = generateFallBackEmailContent({
      subjects,
      isFeminine,
      adminName: fromName,
      clientFirstName,
    });

    await this.smtpClient.sendEmail({
      fromName,
      fromEmail,
      toEmail: formData.user_email,
      subject: "Changement relatif à votre demande de tuteur",
      body,
    });
  }

  private async updateAgentTask(job: any, newJobName: string): Promise<void> {
    const agentName = job.extra_attrs.find(
      (attr: { machine_name: string }) => attr.machine_name === "agent"
    )?.value;

    if (!agentName) return;

    const formattedAgent = formatAgentName(agentName);
    const agentProjects = await this.supabase.getByFilter("pairing_agents", {
      slug: formattedAgent,
    });

    if (agentProjects.length === 0) return;

    const projectId = agentProjects[0].id_projet_asana;
    const taskName = `MANDAT CHANGÉ POUR EN LIGNE - ${job.name}`;

    const taskResult = await this.asana.getTaskByName(
      "1131727432690028",
      projectId,
      job.name
    );
    const task = taskResult?.data?.[0];

    if (task?.gid) {
      await this.asana.updateTask(task.gid, {
        name: taskName,
        completed: true,
      });
    }
  }
}
