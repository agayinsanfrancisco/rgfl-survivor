import jwt from "jsonwebtoken";
import prisma from "./prisma.js";
const JWT_SECRET = process.env.JWT_SECRET || "development-insecure-jwt-secret";
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    console.warn("JWT_SECRET is not set. Using an insecure fallback secret.");
}
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const token = bearerToken || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
}
export function requireAdmin(req, res, next) {
    authenticate(req, res, async () => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user || !user.isAdmin) {
                return res.status(403).json({ error: "Admin only" });
            }
            next();
        }
        catch (error) {
            console.error("requireAdmin lookup failed:", error);
            next(error);
        }
    });
}
