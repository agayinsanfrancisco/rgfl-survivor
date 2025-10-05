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

router.get("/weeks", async (_, res) => {
  const weeks = await prisma.week.findMany({
    orderBy: { weekNumber: "asc" }
  });
  res.json(weeks);
});

router.get("/analytics", async (_, res) => {
  // Weekly participation - picks submitted per week
  const weeklyParticipation = await prisma.pick.groupBy({
    by: ["weekNumber"],
    _count: { id: true },
    orderBy: { weekNumber: "asc" }
  });

  // User engagement - total picks per user
  const userEngagement = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { picks: true }
      }
    },
    orderBy: {
      picks: {
        _count: "desc"
      }
    }
  });

  // Weekly scoring trends
  const scoringTrends = await prisma.week.findMany({
    orderBy: { weekNumber: "asc" },
    include: {
      scores: {
        select: { points: true }
      }
    }
  });

  const weeklyScores = scoringTrends.map((week) => {
    const totalPoints = week.scores.reduce((sum, score) => sum + score.points, 0);
    const avgPoints = week.scores.length > 0 ? totalPoints / week.scores.length : 0;
    return {
      weekNumber: week.weekNumber,
      totalPoints,
      avgPoints: Math.round(avgPoints * 100) / 100,
      playerCount: week.scores.length
    };
  });

  // Castaway popularity (most drafted)
  const castawayPopularity = await prisma.draftPick.groupBy({
    by: ["castawayId"],
    _count: { id: true }
  });

  const castawayDetails = await prisma.castaway.findMany({
    where: {
      id: { in: castawayPopularity.map((cp) => cp.castawayId) }
    },
    select: { id: true, name: true }
  });

  const popularCastaways = castawayPopularity.map((cp) => ({
    castaway: castawayDetails.find((c) => c.id === cp.castawayId),
    draftCount: cp._count.id
  })).sort((a, b) => b.draftCount - a.draftCount);

  // User statistics
  const totalUsers = await prisma.user.count();
  const usersWithPicks = await prisma.user.count({
    where: { picks: { some: {} } }
  });
  const usersWithRankings = await prisma.user.count({
    where: { ranking: { isNot: null } }
  });

  res.json({
    weeklyParticipation: weeklyParticipation.map((wp) => ({
      week: wp.weekNumber,
      picks: wp._count.id
    })),
    userEngagement: userEngagement.map((ue) => ({
      name: ue.name,
      pickCount: ue._count.picks
    })),
    scoringTrends: weeklyScores,
    popularCastaways,
    userStats: {
      total: totalUsers,
      withPicks: usersWithPicks,
      withRankings: usersWithRankings,
      participationRate: Math.round((usersWithPicks / totalUsers) * 100)
    }
  });
});

router.get("/analytics/win-probability", async (_, res) => {
  // Get all users with scores
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      scores: {
        include: { week: true },
        orderBy: { week: { weekNumber: "asc" } }
      }
    }
  });

  // Get total weeks and completed weeks with scores
  const totalWeeks = await prisma.week.count();
  const completedWeeks = await prisma.week.count({
    where: { scores: { some: {} } }
  });
  const remainingWeeks = totalWeeks - completedWeeks;

  // Calculate for each user
  const probabilities = users.map(user => {
    const currentPoints = user.scores.reduce((sum, s) => sum + s.points, 0);
    const avgPoints = completedWeeks > 0 ? currentPoints / completedWeeks : 0;
    const projectedPoints = currentPoints + (avgPoints * remainingWeeks);

    return {
      userId: user.id,
      name: user.name,
      currentPoints,
      avgPointsPerWeek: Math.round(avgPoints * 100) / 100,
      projectedPoints: Math.round(projectedPoints),
      winProbability: 0 // Will calculate after getting max
    };
  });

  // Calculate probabilities based on projected scores
  const maxProjected = Math.max(...probabilities.map(p => p.projectedPoints), 1);

  probabilities.forEach(p => {
    p.winProbability = maxProjected > 0
      ? Math.round((p.projectedPoints / maxProjected) * 100)
      : 0;
  });

  probabilities.sort((a, b) => b.winProbability - a.winProbability);

  res.json({
    completedWeeks,
    remainingWeeks,
    totalWeeks,
    probabilities
  });
});

router.get("/analytics/power-rankings", async (_, res) => {
  const users = await prisma.user.findMany({
    include: {
      scores: { include: { week: true } },
      picks: true,
      draftPicks: { include: { castaway: { include: { weeklyResults: true } } } }
    }
  });

  const totalWeeks = await prisma.week.count();

  const rankings = users.map(user => {
    // Total points (40% weight)
    const totalPoints = user.scores.reduce((sum, s) => sum + s.points, 0);

    // Consistency score (20% weight) - inverse of std deviation
    const points = user.scores.map(s => s.points);
    const mean = points.length > 0 ? points.reduce((a, b) => a + b, 0) / points.length : 0;
    const variance = points.length > 0 ? points.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / points.length : 0;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = mean > 0 ? Math.max(0, 100 - (stdDev / mean * 100)) : 0;

    // Recent form (20% weight) - last 3 weeks vs season avg
    const recentScores = user.scores.slice(-3).map(s => s.points);
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
    const recentForm = mean > 0 ? Math.min((recentAvg / mean) * 100, 200) : 0;

    // Participation (10% weight)
    const participationRate = totalWeeks > 0 ? (user.picks.length / totalWeeks) * 100 : 0;

    // Draft quality (10% weight)
    const draftPoints = user.draftPicks.reduce((sum, dp) => {
      return sum + dp.castaway.weeklyResults.reduce((s, wr) => s + wr.points, 0);
    }, 0);
    const draftQuality = user.draftPicks.length > 0 ? Math.min((draftPoints / user.draftPicks.length) * 2, 100) : 0;

    // Calculate power score (weighted average, normalized to 100)
    const powerScore = (
      Math.min(totalPoints * 0.4, 40) + // Cap at 40 points max
      (consistencyScore * 0.2) +
      (Math.min(recentForm, 100) * 0.2) +
      (participationRate * 0.1) +
      (draftQuality * 0.1)
    );

    return {
      userId: user.id,
      name: user.name,
      powerScore: Math.round(powerScore * 10) / 10,
      powerRank: 0, // Will be set after sorting
      metrics: {
        totalPoints,
        consistencyScore: Math.round(consistencyScore),
        recentForm: Math.round(Math.min(recentForm, 100)),
        participationRate: Math.round(participationRate),
        draftQuality: Math.round(draftQuality)
      }
    };
  });

  rankings.sort((a, b) => b.powerScore - a.powerScore);
  rankings.forEach((r, i) => r.powerRank = i + 1);

  res.json(rankings);
});

router.get("/analytics/head-to-head", async (req, res) => {
  const { user1, user2 } = req.query as { user1?: string; user2?: string };

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both user1 and user2 are required" });
  }

  const users = await prisma.user.findMany({
    where: { id: { in: [user1, user2] } },
    include: {
      scores: { include: { week: true }, orderBy: { week: { weekNumber: "asc" } } }
    }
  });

  if (users.length !== 2) {
    return res.status(404).json({ error: "One or both users not found" });
  }

  const [userOne, userTwo] = users;

  // Get all weeks
  const allWeeks = await prisma.week.findMany({ orderBy: { weekNumber: "asc" } });

  // Build weekly comparison
  const weeklyComparison = allWeeks.map(week => {
    const user1Score = userOne.scores.find(s => s.week.weekNumber === week.weekNumber);
    const user2Score = userTwo.scores.find(s => s.week.weekNumber === week.weekNumber);

    const user1Points = user1Score?.points || 0;
    const user2Points = user2Score?.points || 0;

    return {
      week: week.weekNumber,
      user1Points,
      user2Points,
      winner: user1Points > user2Points ? 'user1' :
              user2Points > user1Points ? 'user2' : 'tie'
    };
  });

  // Calculate summary
  const user1Wins = weeklyComparison.filter(w => w.winner === 'user1').length;
  const user2Wins = weeklyComparison.filter(w => w.winner === 'user2').length;
  const ties = weeklyComparison.filter(w => w.winner === 'tie').length;

  const totalUser1Points = userOne.scores.reduce((sum, s) => sum + s.points, 0);
  const totalUser2Points = userTwo.scores.reduce((sum, s) => sum + s.points, 0);

  res.json({
    user1: { id: userOne.id, name: userOne.name, totalPoints: totalUser1Points },
    user2: { id: userTwo.id, name: userTwo.name, totalPoints: totalUser2Points },
    weeklyComparison,
    summary: {
      user1Wins,
      user2Wins,
      ties,
      avgPointDiff: weeklyComparison.length > 0 ? Math.abs(totalUser1Points - totalUser2Points) / weeklyComparison.length : 0
    }
  });
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
