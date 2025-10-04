import { Router } from "express";
import { z } from "zod";
import prisma from "./prisma.js";
import { requireAdmin } from "./middleware.js";

const router = Router();

router.use(requireAdmin);

const scorePayload = z.object({
  entries: z.array(z.object({ castawayId: z.string().uuid(), points: z.number().int() })).nonempty()
});

router.post("/week/:weekNumber", async (req, res) => {
  const parsed = scorePayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const weekNumber = Number(req.params.weekNumber);
  if (Number.isNaN(weekNumber)) {
    return res.status(400).json({ error: "Invalid week number" });
  }

  const week = await prisma.week.findFirst({ where: { weekNumber } });
  if (!week) {
    return res.status(404).json({ error: "Week not found" });
  }

  const { entries } = parsed.data;

  await prisma.$transaction(async (tx) => {
    for (const entry of entries) {
      await tx.weeklyResult.upsert({
        where: {
          weekNumber_castawayId: {
            weekNumber,
            castawayId: entry.castawayId
          }
        },
        update: { points: entry.points },
        create: { weekNumber, castawayId: entry.castawayId, points: entry.points }
      });
    }

    const picks = await tx.pick.findMany({
      where: { weekNumber },
      include: { user: true }
    });

    const pointsByUser = new Map<string, number>();

    for (const entry of entries) {
      const relevantPicks = picks.filter((pick) => pick.castawayId === entry.castawayId);
      for (const pick of relevantPicks) {
        pointsByUser.set(pick.userId, (pointsByUser.get(pick.userId) ?? 0) + entry.points);
      }
    }

    for (const [userId, totalPoints] of pointsByUser.entries()) {
      await tx.score.upsert({
        where: {
          userId_weekId: {
            userId,
            weekId: week.id
          }
        },
        update: {
          points: totalPoints
        },
        create: {
          userId,
          weekId: week.id,
          points: totalPoints
        }
      });
    }
  });

  const leaderboard = await prisma.score.groupBy({
    by: ["userId"],
    _sum: { points: true }
  });

  res.json({ success: true, leaderboard });
});

export default router;
