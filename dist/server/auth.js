import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "./prisma.js";
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "development-insecure-jwt-secret";
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    console.warn("JWT_SECRET is not set. Using an insecure fallback secret.");
}
const sameSiteSetting = process.env.NODE_ENV === "production" ? "none" : "lax";
const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: sameSiteSetting,
    maxAge: 7 * 24 * 60 * 60 * 1000
};
// Zod schemas
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2)
});
router.post("/signup", async (req, res) => {
    try {
        const data = signupSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            return res.status(409).json({ error: "Email already in use" });
        let league = await prisma.league.findFirst();
        if (!league) {
            league = await prisma.league.create({
                data: {
                    name: "Reality Games Survivor League",
                    code: "RGFL2024"
                }
            });
        }
        const hash = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { ...data, password: hash, leagueId: league.id }
        });
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "7d" });
        res
            .cookie("token", token, authCookieOptions)
            .json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token });
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
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });
        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid email or password" });
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, SECRET, { expiresIn: "7d" });
        res
            .cookie("token", token, authCookieOptions)
            .json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, token });
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
        const cookieToken = req.cookies?.token;
        const token = req.headers.authorization?.replace("Bearer ", "") || cookieToken;
        if (!token)
            return res.status(401).json({ error: "No token" });
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
    res
        .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: sameSiteSetting
    })
        .json({ message: "Logged out successfully" });
});
router.post("/forgot-password", (_req, res) => {
    res.status(501).json({ error: "Password reset is not yet available." });
});
router.post("/reset-password", (_req, res) => {
    res.status(501).json({ error: "Password reset is not yet available." });
});
export default router;
