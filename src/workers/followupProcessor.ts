import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { FollowUpHandler } from "../services/tutorat/followupHandler";

const followupHandler = new FollowUpHandler();

export const followupWorker = new Worker(
  "followup-jobs",
  async (job) => {
    await followupHandler.process(job.data);
  },
  {
    connection: redisConnection,
  }
);
