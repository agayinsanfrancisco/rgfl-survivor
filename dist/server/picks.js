import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
// Get my picks for current week
router.get("/me", async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const week = await prisma.week.findFirst({ where: { isActive: true } });
    if (!week)
        return res.status(404).json({ error: "No active week" });
    const pick = await prisma.pick.findFirst({
        where: { userId, weekNumber: week.weekNumber },
        include: { castaway: true }
    });
    res.json(pick);
});
// Submit a pick for this week
router.post("/me", async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { castawayId } = req.body;
    const week = await prisma.week.findFirst({ where: { isActive: true } });
    if (!week)
        return res.status(404).json({ error: "No active week" });
    const existing = await prisma.pick.findFirst({
        where: { userId, weekNumber: week.weekNumber }
    });
    if (existing) {
        // Update existing
        const updated = await prisma.pick.update({
            where: { id: existing.id },
            data: { castawayId }
        });
        return res.json(updated);
    }
    // Create new pick
    const newPick = await prisma.pick.create({
        data: { userId, weekNumber: week.weekNumber, castawayId }
    });
    res.json(newPick);
});
// Admin: get all picks for a week
router.get("/week/:weekNumber", async (req, res) => {
    const { weekNumber } = req.params;
    const picks = await prisma.pick.findMany({
        where: { weekNumber: parseInt(weekNumber) },
        include: { user: true, castaway: true }
    });
    res.json(picks);
});
export default router;
