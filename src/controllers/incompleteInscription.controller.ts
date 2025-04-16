import { Request, Response } from "express";
import { IncompleteInscriptionProcessor } from "../services/incompleteInscription/IncompleteInscriptionProcessor";

export const handleIncompleteInscription = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const formData: Record<string, any> = req.body;
    // console.log("formData reçu : ", JSON.stringify(formData, null, 2));
    const branchId = parseInt(formData?.branchID || "0");
    // console.log("branch Id reçu dans le formulaire : ", branchId);
    const processor = new IncompleteInscriptionProcessor(formData, branchId);
    const result = processor.process();
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error in incomplete inscription handler:", error);
    return res.status(500).json({ error: error.message || "Unknown error" });
  }
};
