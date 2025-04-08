import { SMTPMailClient } from "../../clients/smtp-mail.client";
import {
  generateEmailToClientManager,
  generateFollowUpEmailContent,
} from "../../utils/common/emails/generateFollowUpEmailContent";
import { getClient } from "../clientStudentService";
import { getJobInfo } from "../serviceService";

export async function handleFollowUpEmail(data: {
  jobId: number;
  clientId: number;
  branchId: number;
  formData: Record<string, any>;
  step: number;
}) {
  console.log("follow up handler !! ");
  const { jobId, branchId, clientId, formData, step } = data;
  const job = await getJobInfo(branchId, jobId.toString());
  const isAvailable = job?.status == "available";

  if (!isAvailable) {
    console.log("not available!");
    return;
  }

  const clientData = await getClient(branchId, clientId.toString());
  const admin = clientData?.associated_admin;
  const fromName = "Tutorax";
  const fromEmail = "contact@tutorax.com";
  const clientLastName = formData.nom_parent.last_name;

  if (step == 1 || step == 3 || step == 4) {
    const title = formData.title;
    const body = generateFollowUpEmailContent({ step, clientLastName, title });
    const SubjectsClient: Record<number, string> = {
      1: "Suivi de votre demande - Tuteur en présentiel",
      3: "Suivi important - Recherche d’un tuteur en présentiel",
      4: "Manque de disponibilité de tuteurs - Dernières options pour votre demande",
    };

    const smtpClient = new SMTPMailClient();
    await smtpClient.sendEmail({
      fromName,
      fromEmail,
      toEmail: formData.user_email,
      subject: SubjectsClient[step],
      body,
    });
  }

  if (step == 2 && admin?.email) {
    const smtpClient = new SMTPMailClient();
    const body = generateEmailToClientManager(job.id);
    console.log("send email to agent : ");
    await smtpClient.sendEmail({
      fromName,
      fromEmail,
      toEmail: "souhaila@tutorax.com", // admin.email,
      subject: "Task à créer sur TC - Vendre en ligne",
      body,
    });
  }
}
