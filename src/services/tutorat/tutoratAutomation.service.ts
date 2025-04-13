import { ClientAndStudentProcessor } from "./ClientStudentProcessor";
import { JobProcessor } from "./JobProcessor";
import { createAdhocChargeIfNeeded } from "./processAdhocCharge";

export async function runTutoratAutomation(
  formData: Record<string, any>,
  branchId: number
) {
  // ------------ Client and student ---------------
  console.log("--------------------- process Started ------------------");
  const clientProcessor = new ClientAndStudentProcessor(formData, branchId);
  const { clientId, studentId, clientAdresse, clientCity } =
    await clientProcessor.process();
  console.log("client handled !");
  //----------------- Adhoc charge -----------------
  await createAdhocChargeIfNeeded(formData, branchId, clientId);
  console.log("adhoc charge handled !");
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
  console.log("job(s) hendled !");
}
