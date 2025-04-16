import { Router } from "express";
import { handleIncompleteInscription } from "../controllers/incompleteInscription.controller";

const router = Router();

router.post("/incomplete-inscription", handleIncompleteInscription);

export default router;
