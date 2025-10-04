import { Router } from "express";
import prisma from "./prisma.js";
import { authenticate, requireAdmin } from "./middleware.js";

const router = Router();

router.use(authenticate);

router.get("/me", async (req, res) => {
  const userId = (req as any).user?.id;
  const week = await prisma.week.findFirst({ where: { isActive: true } });
  if (!week) {
    return res.status(404).json({ error: "No active week" });
  }

  const pick = await prisma.pick.findFirst({
    where: { userId, weekNumber: week.weekNumber },
    include: { castaway: true }
  });
  res.json(pick);
});

router.post("/me", async (req, res) => {
  const userId = (req as any).user?.id;
  const { castawayId } = req.body as { castawayId?: string };

  if (!castawayId) {
    return res.status(400).json({ error: "castawayId is required" });
  }

  const week = await prisma.week.findFirst({ where: { isActive: true } });
  if (!week) {
    return res.status(404).json({ error: "No active week" });
  }

  const existing = await prisma.pick.findFirst({
    where: { userId, weekNumber: week.weekNumber }
  });

  const pick = existing
    ? await prisma.pick.update({
        where: { id: existing.id },
        data: { castawayId }
      })
    : await prisma.pick.create({
        data: { userId, weekNumber: week.weekNumber, castawayId }
      });

  res.json(pick);
});

router.get("/week/:weekNumber", requireAdmin, async (req, res) => {
  const weekNumber = Number(req.params.weekNumber);
  const picks = await prisma.pick.findMany({
    where: { weekNumber },
    include: { user: true, castaway: true }
  });
  res.json(picks);
});

export default router;
