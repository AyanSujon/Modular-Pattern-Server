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
            idActive BOOLEAN DEFAULT TRUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initializing database:", error)
    }
}

initDB();

















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
