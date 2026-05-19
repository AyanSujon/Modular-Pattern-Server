import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";


// Post endpoint to create a new user
const createUser = async (req : Request, res : Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
    })
    console.log("User created successfully:", result.rows[0]);
  } catch (error: any) {
    console.error("Error creating user:", error)
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error,
      data: null
      
    })
  }
}




export const userController = {
    createUser
}