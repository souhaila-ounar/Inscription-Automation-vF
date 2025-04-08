import { Redis } from "ioredis";
import "dotenv/config";

export const redisConnection = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});
