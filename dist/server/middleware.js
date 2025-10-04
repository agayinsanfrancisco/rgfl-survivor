import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const JWT_SECRET = "ab0a7959c06c1449f2ec58732091d033032adea96fd83a60029444a700c07b4817174d42af32ccd731f2e703b274b63f6d7eb3f300f01a816abf072f8fcd827b";
export function authenticate(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ error: "No token" });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
export async function requireAdmin(req, res, next) {
    await authenticate(req, res, async () => {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isAdmin)
            return res.status(403).json({ error: "Admin only" });
        next();
    });
}
