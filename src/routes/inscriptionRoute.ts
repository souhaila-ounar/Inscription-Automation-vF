import { Router } from "express";
import { handleFormSubmission } from "../controllers/tutorat.controller";
import { validateApiKey } from "../middleware/auth";

const router = Router();

router.post("/submit", handleFormSubmission);
/*
router.post("/test/fallback", async (req, res) => {
  try {
    await checkAndFallbackToOnline(req.body);
    res.status(200).json({ message: "fallback handler !" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Somthing went wrong !!!!" });
  }
});
*/
export const tutoratRoutes = router;
