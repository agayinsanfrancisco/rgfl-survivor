import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "./middleware.js";
const prisma = new PrismaClient();
const router = Router();
// Admin dashboard stats
router.get("/stats", requireAdmin, async (_, res) => {
    const users = await prisma.user.count();
    const picks = await prisma.pick.count();
    const castaways = await prisma.castaway.count();
    res.json({ users, picks, castaways });
});
// Admin: Manage castaways
router.post("/castaway", requireAdmin, async (req, res) => {
    const { name, age, tribe, occupation } = req.body;
    const castaway = await prisma.castaway.create({ data: { name, age, tribe, occupation } });
    res.json(castaway);
});
router.put("/castaway/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, age, tribe, occupation } = req.body;
    const updated = await prisma.castaway.update({
        where: { id },
        data: { name, age, tribe, occupation }
    });
    res.json(updated);
});
router.delete("/castaway/:id", requireAdmin, async (req, res) => {
    const { id } = req.params;
    await prisma.castaway.delete({ where: { id } });
    res.json({ ok: true });
});
// Admin: Manage weeks/seasons (just example endpoints)
router.post("/week", requireAdmin, async (req, res) => {
    const { weekNumber, isActive } = req.body;
    const week = await prisma.week.create({ data: { weekNumber, isActive } });
    res.json(week);
});
router.post("/score", requireAdmin, async (req, res) => {
    const { userId, weekId, points } = req.body;
    const score = await prisma.score.create({ data: { userId, weekId, points } });
    res.json(score);
});
export default router;
