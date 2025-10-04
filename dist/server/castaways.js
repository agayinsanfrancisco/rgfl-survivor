import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
// GET all castaways
router.get("/", async (_, res) => {
    try {
        // Check if database is available
        if (!prisma || !prisma.castaway) {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        const castaways = await prisma.castaway.findMany();
        res.json(castaways);
    }
    catch (error) {
        console.error("Error fetching castaways:", error);
        if (error.code === 'P1001') {
            return res.status(503).json({ error: "Database not available. Please try again later." });
        }
        res.status(500).json({ error: "Failed to fetch castaways" });
    }
});
// GET single castaway
router.get("/:id", async (req, res) => {
    try {
        const c = await prisma.castaway.findUnique({ where: { id: req.params.id } });
        if (!c)
            return res.status(404).json({ error: "Castaway not found" });
        res.json(c);
    }
    catch (error) {
        console.error("Error fetching castaway:", error);
        res.status(500).json({ error: "Failed to fetch castaway" });
    }
});
// ADMIN: Add castaway (if needed)
// router.post("/", ...)
export default router;
