import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const followupQueue = new Queue("followup-jobs", {
  connection: redisConnection,
});
