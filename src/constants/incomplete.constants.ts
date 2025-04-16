type PipelineConstants = {
  MBV_LABEL_ID: number;
  PIPELINE_STAGE_MBV: number;
  PIPELINE_STAGE_RAPPELER: number;
  PIPELINE_STAGE_INFO_DONNEE: number;
};

export const BRANCH_LABELS_AND_PIPELINE: Record<string, PipelineConstants> = {
  "3268": {
    MBV_LABEL_ID: 151991,
    PIPELINE_STAGE_MBV: 31699,
    PIPELINE_STAGE_RAPPELER: 34249,
    PIPELINE_STAGE_INFO_DONNEE: 31700,
  },
  "1234": {
    MBV_LABEL_ID: 157800,
    PIPELINE_STAGE_MBV: 157800,
    PIPELINE_STAGE_RAPPELER: 157800,
    PIPELINE_STAGE_INFO_DONNEE: 157800,
  },
};

export function getBranchPipelineConstants(
  branchId: number
): PipelineConstants {
  const values = BRANCH_LABELS_AND_PIPELINE[String(branchId)];
  if (!values) {
    throw new Error(`No pipeline constants found for branch: ${branchId}`);
  }
  return values;
}
