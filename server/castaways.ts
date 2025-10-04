import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// GET all castaways
router.get("/", async (_, res) => {
  const castaways = await prisma.castaway.findMany();
  res.json(castaways);
});

// GET single castaway
router.get("/:id", async (req, res) => {
  const c = await prisma.castaway.findUnique({ where: { id: req.params.id } });
  if (!c) return res.status(404).json({ error: "Castaway not found" });
  res.json(c);
});

// ADMIN: Add castaway (if needed)
// router.post("/", ...)

export default router;