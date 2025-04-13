import express from "express";
import rateLimit from "express-rate-limit";
import { tutoratRoutes } from "./routes/clientRoute";
import "./workers/fallbackProcessor";
import "./workers/followupProcessor";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { fallbackQueue } from "./queues/fallbackQueue";
import { followupQueue } from "./queues/followupQueue";

const app = express();
const port = 3000;

// ---------- Middleware
app.use(express.json());

app.set("trust proxy", true);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: {
    status: "error",
    message: "Trop de requêtes, réessayez plus tard.",
  },
});
app.use(limiter);

// ---------- BullMQ Board Setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(fallbackQueue), new BullMQAdapter(followupQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

// API Routes
app.use("/api", tutoratRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`BullMQ Board running on http://localhost:${port}/admin/queues`);
});
