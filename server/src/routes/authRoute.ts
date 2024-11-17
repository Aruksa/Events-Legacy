import { Router } from "express";
import { authLoginOrNot } from "../middleware/userLoginOrNot";

const router = Router();

router.get("/me", authLoginOrNot);

export default router;
