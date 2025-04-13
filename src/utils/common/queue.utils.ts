import { Queue } from "bullmq";

export async function enqueueFallbackJob(params: {
  queue: Queue;
  jobId: number;
  studentId: number;
  clientId: number;
  branchId: number;
  formData: Record<string, any>;
  delayInMs?: number;
}) {
  const {
    queue,
    jobId,
    studentId,
    clientId,
    branchId,
    formData,
    delayInMs = 7 * 24 * 60 * 60 * 1000,
  } = params;

  await queue.add(
    "check-fallback",
    {
      jobId,
      studentId,
      clientId,
      branchId,
      formData,
    },
    { delay: delayInMs, attempts: 1 }
  );
}

export async function enqueueFollowupSteps(params: {
  queue: Queue;
  jobId: number;
  clientId: number;
  branchId: number;
  formData: Record<string, any>;
}) {
  const delayInMs = 7 * 24 * 60 * 60 * 1000;

  await params.queue.add(
    "follow-up",
    {
      jobId: params.jobId,
      clientId: params.clientId,
      branchId: params.branchId,
      formData: params.formData,
    },
    { delay: delayInMs, attempts: 1 }
  );
}
