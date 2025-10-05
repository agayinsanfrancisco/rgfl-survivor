-- DropForeignKey
ALTER TABLE "public"."DraftPick" DROP CONSTRAINT "DraftPick_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DraftPick" DROP CONSTRAINT "DraftPick_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ranking" DROP CONSTRAINT "Ranking_userId_fkey";

-- DropEnum
DROP TYPE "public"."UserRole";

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftPick" ADD CONSTRAINT "DraftPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftPick" ADD CONSTRAINT "DraftPick_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
