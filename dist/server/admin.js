import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "./middleware.js";
import prisma from "./prisma.js";
const router = Router();
router.use(requireAdmin);
router.get("/stats", async (_, res) => {
    const [users, picks, castaways, weeks] = await Promise.all([
        prisma.user.count(),
        prisma.pick.count(),
        prisma.castaway.count(),
        prisma.week.count()
    ]);
    res.json({ users, picks, castaways, weeks });
});
const castawaySchema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive().optional(),
    tribe: z.string().optional(),
    occupation: z.string().optional(),
    hometown: z.string().optional(),
    imageUrl: z.string().url().optional()
});
router.post("/castaway", async (req, res) => {
    const payload = castawaySchema.safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ error: payload.error.flatten() });
    }
    const castaway = await prisma.castaway.create({ data: payload.data });
    res.status(201).json(castaway);
});
router.put("/castaway/:id", async (req, res) => {
    const payload = castawaySchema.partial().safeParse(req.body);
    if (!payload.success) {
        return res.status(400).json({ error: payload.error.flatten() });
    }
    const { id } = req.params;
    const updated = await prisma.castaway.update({
        where: { id },
        data: payload.data
    });
    res.json(updated);
});
router.delete("/castaway/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.castaway.delete({ where: { id } });
    res.status(204).end();
});
const weekSchema = z.object({
    weekNumber: z.number().int().positive(),
    isActive: z.boolean().optional()
});
router.post("/week", async (req, res) => {
    const rawWeekNumber = Number(req.body.weekNumber ?? req.body.number ?? req.body.week);
    const payload = weekSchema.safeParse({
        weekNumber: rawWeekNumber,
        isActive: Boolean(req.body.isActive)
    });
    if (!payload.success) {
        return res.status(400).json({ error: payload.error.flatten() });
    }
    const { weekNumber, isActive } = payload.data;
    const existingWeek = await prisma.week.findFirst({ where: { weekNumber } });
    const week = existingWeek
        ? await prisma.week.update({
            where: { id: existingWeek.id },
            data: { isActive }
        })
        : await prisma.week.create({
            data: { weekNumber, isActive: Boolean(isActive) }
        });
    if (isActive) {
        await prisma.week.updateMany({
            where: { weekNumber: { not: weekNumber } },
            data: { isActive: false }
        });
    }
    res.status(201).json(week);
});
const scoreSchema = z.object({
    userId: z.string().uuid(),
    weekId: z.string().uuid(),
    points: z.number().int()
});
router.post("/score", async (req, res) => {
    const payload = scoreSchema.safeParse({
        userId: req.body.userId,
        weekId: req.body.weekId,
        points: Number(req.body.points)
    });
    if (!payload.success) {
        return res.status(400).json({ error: payload.error.flatten() });
    }
    const { userId, weekId, points } = payload.data;
    const existing = await prisma.score.findFirst({
        where: { userId, weekId }
    });
    const score = existing
        ? await prisma.score.update({
            where: { id: existing.id },
            data: { points }
        })
        : await prisma.score.create({ data: { userId, weekId, points } });
    res.json(score);
});
export default router;
