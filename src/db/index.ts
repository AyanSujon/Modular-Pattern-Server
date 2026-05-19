import { Pool } from "pg"
import config from "../config"

export const pool = new Pool({
    connectionString: config.connectionString || "",
})




export const initDB = async() => {
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
