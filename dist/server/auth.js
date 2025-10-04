import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
const router = express.Router();
const prisma = new PrismaClient();
const SECRET = "ab0a7959c06c1449f2ec58732091d033032adea96fd83a60029444a700c07b4817174d42af32ccd731f2e703b274b63f6d7eb3f300f01a816abf072f8fcd827b";
// Zod schemas
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2)
});
router.post("/signup", async (req, res) => {
    try {
        const data = signupSchema.parse(req.body);
        // Check if database is available
        if (!prisma || !prisma.user) {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            return res.status(409).json({ error: "Email already in use" });
        const hash = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { ...data, password: hash }
        });
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "7d" });
        res.json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token });
    }
    catch (err) {
        console.error("Signup error:", err);
        if (err.code === 'P2002') {
            return res.status(409).json({ error: "Email already in use" });
        }
        if (err.code === 'P1001') {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        res.status(400).json({ error: err.message || "Signup failed" });
    }
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});
router.post("/login", async (req, res) => {
    try {
        const data = loginSchema.parse(req.body);
        // Check if database is available
        if (!prisma || !prisma.user) {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });
        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid email or password" });
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "7d" });
        res.json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token });
    }
    catch (err) {
        console.error("Login error:", err);
        if (err.code === 'P1001') {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        res.status(400).json({ error: err.message || "Login failed" });
    }
});
// Get current user
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token)
            return res.status(401).json({ error: "No token" });
        // Check if database is available
        if (!prisma || !prisma.user) {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        const payload = jwt.verify(token, SECRET);
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: { id: true, email: true, name: true, isAdmin: true }
        });
        if (!user)
            return res.status(401).json({ error: "User not found" });
        res.json(user);
    }
    catch (err) {
        console.error("Auth /me error:", err);
        if (err.code === 'P1001') {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        res.status(401).json({ error: "Invalid token" });
    }
});
// Logout
router.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
});
export default router;
