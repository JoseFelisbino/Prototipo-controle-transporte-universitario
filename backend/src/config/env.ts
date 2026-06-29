import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:3636@localhost:5432/transporte_universitario?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'orleans_transporte_secret_key_2026_super_secure_hash',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL not set in environment. Using default.");
}

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET not set in environment. Using default.");
}
