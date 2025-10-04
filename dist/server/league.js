import { Router } from "express";
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
async function buildStandings() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            scores: { select: { points: true } }
        }
    });
    return users
        .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalPoints: user.scores.reduce((sum, score) => sum + score.points, 0)
    }))
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
