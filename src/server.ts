import express, { type Application, type Request, type Response } from "express";
const app: Application = express()
const port = 3000
import {Pool} from "pg"



app.use(express.json());


const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_NraTC2pFQg6y@ep-broad-butterfly-aqg9pi7w-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
})




const initDB = async() => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            isActive BOOLEAN DEFAULT TRUE,
            age INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initializing database:", error)
    }
}

initDB();


// Post endpoint to create a new user
app.post('/api/users', async (req : Request, res : Response) => {
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, age]
    )
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
})





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











































app.get('/', (req : Request, res : Response) => {
  res.status(200).json({ 
    message: `Server is listening on port ${port}`,
    projectName: 'Modular Pattern Server',
    version: '1.0.0'
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
