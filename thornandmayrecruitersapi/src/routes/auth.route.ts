import { Router } from "express";
import { signInUserHandler } from "src/controllers/auth.controller";
const router = Router()

router.post("/login", signInUserHandler)

export default router