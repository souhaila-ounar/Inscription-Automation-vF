import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { JobFallbackHandler } from "../services/tutorat/fallbackHandler";

const fallbackHandler = new JobFallbackHandler();

export const fallbackWorker = new Worker(
  "fallback-jobs",
  async (job) => {
    const data = job.data as {
      jobId: number;
      clientId: number;
      studentId: number;
      branchId: number;
      formData: Record<string, any>;
    };

    await fallbackHandler.handleFallback(data);
  },
  {
    connection: redisConnection,
  }
);
