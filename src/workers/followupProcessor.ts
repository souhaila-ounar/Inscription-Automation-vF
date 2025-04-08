import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { handleFollowUpEmail } from "../services/tutorat/followupHandler";

export const fallbackWorker = new Worker(
  "followup-jobs",
  async (job) => {
    const data = job.data as {
      jobId: number;
      clientId: number;
      branchId: number;
      formData: Record<string, any>;
      step: number;
    };
    await handleFollowUpEmail(data);
  },
  {
    connection: redisConnection,
  }
);
