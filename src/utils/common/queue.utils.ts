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
  console.log("Queue utils !");
  const steps = [1, 2, 3, 4];
  const delays = [5, 8, 14, 21]; // days
  // const delays = [1, 2, 3, 4]; // test ms
  const base = {
    jobId: params.jobId,
    clientId: params.clientId,
    branchId: params.branchId,
    formData: params.formData,
  };

  for (let i = 0; i < steps.length; i++) {
    await params.queue.add(
      `follow-up-step${steps[i]}`,
      {
        ...base,
        step: steps[i],
      },
      { delay: delays[i] * 24 * 60 * 60 * 1000, attempts: 1 }
      // { delay: delays[i] * 60 * 1000, attempts: 1 } //test
    );
  }
}
