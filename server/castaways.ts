import express from "express";
import prisma from "./prisma.js";
const router = express.Router();

// GET all castaways
router.get("/", async (_req, res) => {
  try {
    const castaways = await prisma.castaway.findMany({
      orderBy: { name: "asc" }
    });
    res.json(castaways);
  } catch (error) {
    console.error("Error fetching castaways:", error);
    res.status(500).json({ error: "Failed to fetch castaways" });
  }
});

// GET single castaway
router.get("/:id", async (req, res) => {
  try {
    const c = await prisma.castaway.findUnique({ where: { id: req.params.id } });
    if (!c) return res.status(404).json({ error: "Castaway not found" });
    res.json(c);
  } catch (error) {
    console.error("Error fetching castaway:", error);
    res.status(500).json({ error: "Failed to fetch castaway" });
  }
});

// ADMIN: Add castaway (if needed)
// router.post("/", ...)

export default router;
