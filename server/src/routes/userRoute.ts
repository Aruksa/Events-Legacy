import { Router } from "express";
import { signUp, login, getAllUsers } from "../controllers/userController";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/getallusers", getAllUsers);

export default router;
