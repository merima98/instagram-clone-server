/*
  Warnings:

  - You are about to drop the column `likesCount` on the `Likes` table. All the data in the column will be lost.
  - Made the column `userId` on table `Likes` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "likesCount",
ALTER COLUMN "userId" SET NOT NULL;
