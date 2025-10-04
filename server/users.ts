import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "./middleware.js";

const prisma = new PrismaClient();
const router = Router();

// Get all users (admin only)
router.get("/", requireAdmin, async (_, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, isAdmin: true, createdAt: true }
  });
  res.json(users);
});

// Get my profile
router.get("/me", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, isAdmin: true, createdAt: true }
  });
  res.json(user);
});

// Update my profile
router.put("/me", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, email: true, name: true }
  });
  res.json(user);
});

// Admin: update any user admin status
router.put("/:id/admin", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;
  const updated = await prisma.user.update({ where: { id }, data: { isAdmin } });
  res.json(updated);
});

export default router;