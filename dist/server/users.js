import { Router } from "express";
import prisma from "./prisma.js";
import { authenticate, requireAdmin } from "./middleware.js";
const router = Router();
router.get("/", requireAdmin, async (_req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, isAdmin: true, createdAt: true }
    });
    res.json(users);
});
router.get("/me", authenticate, async (req, res) => {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, isAdmin: true, createdAt: true }
    });
    res.json(user);
});
router.put("/me", authenticate, async (req, res) => {
    const userId = req.user?.id;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const user = await prisma.user.update({
        where: { id: userId },
        data: { name },
        select: { id: true, email: true, name: true, isAdmin: true, createdAt: true }
    });
    res.json(user);
});
router.put("/:id/admin", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.body;
    if (typeof isAdmin !== "boolean") {
        return res.status(400).json({ error: "isAdmin must be a boolean" });
    }
    const updated = await prisma.user.update({ where: { id }, data: { isAdmin } });
    res.json(updated);
});
export default router;
