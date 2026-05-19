import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router()


// Post endpoint to create a new user
router.post('/', userController.createUser)










export const userRoute = router


