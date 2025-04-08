import { SMTPMailClient } from "../../clients/smtp-mail.client";
import { generateEmailToClientManager } from "../../utils/common/emails/generateFollowUpEmailContent";
import { getClient } from "../clientStudentService";
import { getJobInfo } from "../serviceService";

export class FollowUpHandler {
  constructor(private smtpClient = new SMTPMailClient()) {}

  public async process(data: {
    jobId: number;
    clientId: number;
    branchId: number;
    formData: Record<string, any>;
  }) {
    const { jobId, clientId, branchId } = data;

    const job = await getJobInfo(branchId, jobId.toString());
    if (job?.status !== "available") {
      console.log("Job non disponible.");
      return;
    }

    const clientData = await getClient(branchId, clientId.toString());
    const admin = clientData?.associated_admin;

    if (!admin?.email) {
      console.warn("Aucun email d’admin associé.");
      return;
    }

    const body = generateEmailToClientManager(job.id);
    await this.smtpClient.sendEmail({
      fromName: `${admin.first_name} ${admin.last_name}`,
      fromEmail: admin.email,
      toEmail: admin.email,
      subject: "Task à créer sur TC - Vendre en ligne",
      body,
    });

    console.log("Email de relance envoyé à l’admin.");
  }
}
