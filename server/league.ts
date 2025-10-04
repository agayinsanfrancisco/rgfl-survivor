import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Only one league per season: fetch global league, users
router.get("/", async (req, res) => {
  const league = await prisma.league.findFirst({
    include: {
      users: { select: { id: true, name: true, email: true } }
    }
  });
  res.json(league);
});

// My league standings
router.get("/standings", async (req, res) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  
  // Get all users with their total scores
  const users = await prisma.user.findMany({
    include: {
      scores: true
    },
    orderBy: {
      scores: {
        _count: 'desc'
      }
    }
  });
  
  // Calculate total points for each user
  const standings = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    totalPoints: user.scores.reduce((sum, score) => sum + score.points, 0)
  })).sort((a, b) => b.totalPoints - a.totalPoints);
  
  res.json(standings);
});

export default router;