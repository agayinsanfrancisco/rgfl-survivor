import { Router } from "express";
import prisma from "./prisma.js";
import { authenticate, requireAdmin } from "./middleware.js";

const router = Router();

router.use(authenticate);

function buildSnakeOrder<T>(items: T[], round: number): T[] {
  if (round % 2 === 0) {
    return items;
  }
  return [...items].reverse();
}

router.get("/assigned", async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const picks = await prisma.draftPick.findMany({
    where: { userId },
    include: { castaway: true },
    orderBy: { round: "asc" }
  });

  res.json({ picks });
});

router.get("/status", async (_req, res) => {
  const league = await prisma.league.findFirst();
  if (!league) {
    return res.status(400).json({ error: "League not configured" });
  }

  const picks = await prisma.draftPick.findMany({
    where: { leagueId: league.id },
    include: { user: { select: { id: true, name: true, email: true } }, castaway: true },
    orderBy: { pickNumber: "asc" }
  });

  res.json({
    draftStatus: league.draftStatus,
    draftRunAt: league.draftRunAt,
    picks
  });
});

router.post("/run", requireAdmin, async (_req, res) => {
  const league = await prisma.league.findFirst({
    include: {
      users: {
        include: {
          ranking: {
            include: {
              entries: { orderBy: { position: "asc" } }
            }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!league) {
    return res.status(400).json({ error: "League not configured" });
  }

  if (league.users.length === 0) {
    return res.status(400).json({ error: "No users to draft" });
  }

  const eligibleUsers = league.users.filter((user) => user.ranking && user.ranking.entries.length > 0);

  if (eligibleUsers.length === 0) {
    return res.status(400).json({ error: "No submitted rankings" });
  }

  const castaways = await prisma.castaway.findMany({ select: { id: true } });
  const availableCastaways = new Set(castaways.map((c) => c.id));

  const assignments: {
    userId: string;
    castawayId: string;
    round: number;
  }[] = [];

  for (let round = 0; round < league.picksPerUser; round++) {
    const roundOrder = buildSnakeOrder(eligibleUsers, round);
    for (const user of roundOrder) {
      const rankingEntries = user.ranking?.entries ?? [];
      const pick = rankingEntries.find((entry) => availableCastaways.has(entry.castawayId));
      if (!pick) {
        continue;
      }
      availableCastaways.delete(pick.castawayId);
      assignments.push({ userId: user.id, castawayId: pick.castawayId, round: round + 1 });
      if (availableCastaways.size === 0) {
        break;
      }
    }
    if (availableCastaways.size === 0) {
      break;
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.draftPick.deleteMany({ where: { leagueId: league.id } });
    if (assignments.length > 0) {
      await tx.draftPick.createMany({
        data: assignments.map((assignment, index) => ({
          ...assignment,
          leagueId: league.id,
          pickNumber: index + 1
        }))
      });
    }

    await tx.league.update({
      where: { id: league.id },
      data: {
        draftStatus: "COMPLETED",
        draftRunAt: new Date(),
        rankingLockAt: league.rankingLockAt ?? new Date()
      }
    });
  });

  const picks = await prisma.draftPick.findMany({
    where: { leagueId: league.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      castaway: true
    },
    orderBy: { pickNumber: "asc" }
  });

  res.json({ success: true, picks });
});

router.post("/reset", requireAdmin, async (_req, res) => {
  const league = await prisma.league.findFirst();
  if (!league) {
    return res.status(400).json({ error: "League not configured" });
  }

  await prisma.$transaction(async (tx) => {
    await tx.draftPick.deleteMany({ where: { leagueId: league.id } });
    await tx.league.update({
      where: { id: league.id },
      data: {
        draftStatus: "PENDING",
        draftRunAt: null
      }
    });
  });

  res.json({ success: true, message: "Draft reset successfully" });
});

router.post("/manual", requireAdmin, async (req, res) => {
  const { userId, castawayId, round } = req.body as {
    userId?: string;
    castawayId?: string;
    round?: number;
  };

  if (!userId || !castawayId || !round) {
    return res.status(400).json({ error: "userId, castawayId, and round are required" });
  }

  const league = await prisma.league.findFirst();
  if (!league) {
    return res.status(400).json({ error: "League not configured" });
  }

  const existingPick = await prisma.draftPick.findUnique({
    where: { leagueId_userId_round: { leagueId: league.id, userId, round } }
  });

  if (existingPick) {
    await prisma.draftPick.update({
      where: { id: existingPick.id },
      data: { castawayId }
    });
  } else {
    const maxPickNumber = await prisma.draftPick.findFirst({
      where: { leagueId: league.id },
      orderBy: { pickNumber: "desc" },
      select: { pickNumber: true }
    });

    await prisma.draftPick.create({
      data: {
        userId,
        castawayId,
        leagueId: league.id,
        round,
        pickNumber: (maxPickNumber?.pickNumber ?? 0) + 1
      }
    });
  }

  const picks = await prisma.draftPick.findMany({
    where: { leagueId: league.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      castaway: true
    },
    orderBy: { pickNumber: "asc" }
  });

  res.json({ success: true, picks });
});

router.delete("/manual/:pickId", requireAdmin, async (req, res) => {
  const { pickId } = req.params;

  await prisma.draftPick.delete({
    where: { id: pickId }
  });

  res.json({ success: true, message: "Pick deleted" });
});

export default router;
