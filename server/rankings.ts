import { Router } from "express";
import prisma from "./prisma.js";
import { authenticate, requireAdmin } from "./middleware.js";

const router = Router();

router.use(authenticate);

router.get("/me", async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const league = await prisma.league.findFirst();
  const locked = league?.draftStatus === "COMPLETED" || Boolean(league?.rankingLockAt);

  const ranking = await prisma.ranking.findUnique({
    where: { userId },
    include: {
      entries: {
        include: { castaway: true },
        orderBy: { position: "asc" }
      }
    }
  });

  if (!ranking) {
    const castaways = await prisma.castaway.findMany({ orderBy: { name: "asc" } });
    return res.json({
      submitted: false,
      locked,
      order: castaways.map((c) => ({ castawayId: c.id, castaway: c }))
    });
  }

  return res.json({
    submitted: true,
    submittedAt: ranking.submittedAt,
    locked,
    order: ranking.entries.map((entry) => ({
      castawayId: entry.castawayId,
      castaway: entry.castaway,
      position: entry.position
    }))
  });
});

router.post("/me", async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const league = await prisma.league.findFirst();
  if (!league) {
    return res.status(400).json({ error: "League not configured" });
  }

  if (league.draftStatus === "COMPLETED" || league.rankingLockAt) {
    return res.status(409).json({ error: "Rankings are locked" });
  }

  const order = req.body?.order as string[] | undefined;
  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: "order must be a non-empty array of castaway IDs" });
  }

  const castaways = await prisma.castaway.findMany({ select: { id: true } });
  const castawayIds = new Set(castaways.map((c) => c.id));

  if (order.length !== castaways.length) {
    return res.status(400).json({ error: "Ranking must include every castaway" });
  }

  const unique = new Set(order);
  if (unique.size !== order.length) {
    return res.status(400).json({ error: "Duplicate castaway IDs in ranking" });
  }

  const missing = order.filter((id) => !castawayIds.has(id));
  if (missing.length) {
    return res.status(400).json({ error: `Invalid castaway IDs: ${missing.join(",")}` });
  }

  await prisma.$transaction(async (tx) => {
    const ranking = await tx.ranking.upsert({
      where: { userId },
      update: { submittedAt: new Date() },
      create: { userId }
    });

    await tx.rankingEntry.deleteMany({ where: { rankingId: ranking.id } });

    await tx.rankingEntry.createMany({
      data: order.map((castawayId, index) => ({
        rankingId: ranking.id,
        castawayId,
        position: index + 1
      }))
    });
  });

  return res.json({ success: true });
});

router.get("/admin/overview", requireAdmin, async (_req, res) => {
  const rankings = await prisma.ranking.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      entries: {
        include: { castaway: true },
        orderBy: { position: "asc" }
      }
    }
  });

  res.json(rankings.map((ranking) => ({
    user: ranking.user,
    submittedAt: ranking.submittedAt,
    entries: ranking.entries.map((entry) => ({
      position: entry.position,
      castawayId: entry.castawayId,
      castaway: entry.castaway
    }))
  })));
});

export default router;
