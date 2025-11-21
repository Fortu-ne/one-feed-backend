import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config(); // Initialize dotenv to load .env file

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PSSWD,
});



pool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export default pool;
