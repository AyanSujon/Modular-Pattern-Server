import express, { type Application, type Request, type Response } from "express";

import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express()



app.use(express.json());


// Post endpoint to create a new user
app.use("/api/users", userRoute);







// Get endpoint to retrieve all users
app.get('/api/users', async (req : Request, res : Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`)
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows
      })
    console.log("Users retrieved successfully:", result.rows);
  } catch (error: any) {

    console.error("Error retrieving users:", error)
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error,
      data: null
      
    })
  }
})



// Get endpoint to retrieve a user by ID
app.get('/api/users/:id', async (req : Request, res : Response) => {
  const userId = req.params.id; 
  console.log("Retrieving user with ID:", userId);
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId])
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null
      });
    }
    console.log("Retrieving user with ID:", result.rows[0]);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
      data: null
    });
  }
})






// Put endpoint to update a user by ID
app.put('/api/users/:id', async (req : Request, res : Response) => {
  const {id} = req.params; 
  const { name, email, password, age, isActive} = req.body; 
  console.log("Updating user with ID:", id);
  console.log("Request body:", req.body);
  try {
    const result = await pool.query(
      `UPDATE users 
      SET
      name = COALESCE($1, name), 
      email = COALESCE($2, email), 
      password = COALESCE($3, password), 
      age = COALESCE($4, age), 
      isActive = COALESCE($5, isActive), 
      updatedAt = CURRENT_TIMESTAMP 
      WHERE id = $6 RETURNING *`,
      [name, email, password, age, isActive, id]
    );
    console.log("Update result:", result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
      data: null
    });
  }
});







// Delete endpoint to delete a user by ID
app.delete('/api/users/:id', async (req : Request, res : Response) => {
  const {id} = req.params; 
  console.log("Deleting user with ID:", id); 
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id])
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found",
        data: null
      });
    } 
    console.log("User deleted successfully:", result.rows[0]);
    res.status(200).json({
      success: true,  
      message: "User deleted successfully",
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      error: error, 
      data: null
    });
  } 
})






















app.get('/', (req : Request, res : Response) => {
  res.status(200).json({ 
    message: `Server is listening `,
    projectName: 'Modular Pattern Server',
    version: '1.0.0'
  })
})

export default app;