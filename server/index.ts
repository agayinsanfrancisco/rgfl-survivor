// server/index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import type { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./auth.js";
import castawayRoutes from "./castaways.js";
import pickRoutes from "./picks.js";
import userRoutes from "./users.js";
import adminRoutes from "./admin.js";
import leagueRoutes from "./league.js";
import setupRoutes from "./setup.js";
import resultsRoutes from "./results.js";
import prisma from "./prisma.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5050;

async function ensureDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

ensureDatabaseConnection();

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = (process.env.CLIENT_ORIGIN || process.env.CORS_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? allowedOrigins.length > 0
        ? allowedOrigins
        : true
      : true,
  credentials: true
};

if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  console.warn("No CLIENT_ORIGIN configured. Defaulting to allow all origins.");
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/castaways", castawayRoutes);
app.use("/api/picks", pickRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/setup", setupRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const publicPath = path.resolve(process.cwd(), "dist", "public");
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
