import { Router } from "express";
import { z } from "zod";
import prisma from "./prisma.js";
import { authenticate, requireAdmin } from "./middleware.js";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  const league = await prisma.league.findFirst({
    include: {
      users: {
        select: { id: true, name: true, email: true, isAdmin: true }
      }
    }
  });
  res.json(league);
});

const leagueUpdateSchema = z.object({
  picksPerUser: z.number().int().min(1).max(10).optional(),
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional()
});

router.put("/", requireAdmin, async (req, res) => {
  const payload = leagueUpdateSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ error: payload.error.flatten() });
  }

  const league = await prisma.league.findFirst();
  if (!league) {
    return res.status(404).json({ error: "League not found" });
  }

  const updated = await prisma.league.update({
    where: { id: league.id },
    data: payload.data,
    include: {
      users: {
        select: { id: true, name: true, email: true, isAdmin: true }
      }
    }
  });

  res.json(updated);
});

async function buildStandings() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      draftPicks: {
        include: { castaway: true },
        orderBy: { round: "asc" }
      },
      scores: {
        select: { points: true }
      }
    }
  });

  return users
    .map((user) => {
      const totalPoints = user.scores.reduce((sum, score) => sum + score.points, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalPoints,
        rawPoints: totalPoints,
        draftPicks: user.draftPicks
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

router.get("/standings", authenticate, async (_req, res) => {
  const standings = await buildStandings();
  res.json(standings);
});

router.get("/leaderboard", async (_req, res) => {
  const standings = await buildStandings();
  res.json(standings.slice(0, 20));
});

export default router;
