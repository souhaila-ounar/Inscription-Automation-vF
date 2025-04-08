import { ClientAndStudentProcessor } from "./ClientStudentProcessor";
import { JobProcessor } from "./JobProcessor";
import { createAdhocChargeIfNeeded } from "./processAdhocCharge";

export async function runTutoratAutomation(
  formData: Record<string, any>,
  branchId: number
) {
  // ------------ Client and student ---------------
  const clientProcessor = new ClientAndStudentProcessor(formData, branchId);
  const { clientId, studentId, clientAdresse, clientCity } =
    await clientProcessor.process();

  //----------------- Adhoc charge -----------------
  await createAdhocChargeIfNeeded(formData, branchId, clientId);

  //-------------------- Creation des mandats et suivi (1 & 2 )  ---------
  const jobProcessor = new JobProcessor(
    formData,
    branchId,
    clientId,
    studentId,
    clientAdresse,
    clientCity
  );

  await jobProcessor.createAllJobs();
}
