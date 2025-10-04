// server/index.ts
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./auth.js";
import castawayRoutes from "./castaways.js";
import pickRoutes from "./picks.js";
import userRoutes from "./users.js";
import pointRoutes from "./admin.js";
import seasonRoutes from "./admin.js";
import leagueRoutes from "./league.js";
import setupRoutes from "./setup.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

// Initialize Prisma with your specific database URL
let prisma: PrismaClient;
try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://rgfl_survivor_db_user:cPam8QBgB6uK7lUBZHDUgo7uAhIsMKSV@dpg-d3fohbc9c44c73dagrm0-a/rgfl_survivor_db"
      }
    }
  });
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  // Create a mock prisma client for development
  prisma = {} as PrismaClient;
}

const PORT = process.env.PORT || 5050;

// Database initialization function
async function initializeDatabase() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connection established");
    
    // Try to create tables if they don't exist
    try {
      await prisma.user.findFirst();
      console.log("Database tables already exist");
    } catch (error) {
      console.log("Database tables don't exist, attempting to create...");
      try {
        // Try to push schema directly
        const { execSync } = await import('child_process');
        execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
        console.log("Database schema created successfully");
        
        // Run seed data
        execSync('npm run db:seed', { stdio: 'inherit' });
        console.log("Database seeded successfully");
      } catch (seedError) {
        console.error("Failed to create database schema:", seedError);
      }
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    console.log("Continuing without database connection...");
  }
}

// Initialize database
initializeDatabase();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? "https://rgfl-survivor.onrender.com"
    : true,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(session({
  secret: "ab0a7959c06c1449f2ec58732091d033032adea96fd83a60029444a700c07b4817174d42af32ccd731f2e703b274b63f6d7eb3f300f01a816abf072f8fcd827b",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/castaways", castawayRoutes);
app.use("/api/picks", pickRoutes);
app.use("/api/users", userRoutes);
app.use("/api/points", pointRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/setup", setupRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '..', 'dist', 'public');
  app.use(express.static(publicPath, {
    maxAge: 0, // Disable caching for development
    etag: false
  }));
  
  // Serve React app for non-API routes
  app.get('/', (req, res) => {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  
  // Catch all handler for client-side routing (but not API routes)
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  app.get("/", (_, res) => res.send("RGFL backend is running."));
}

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});