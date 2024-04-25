/*
  Warnings:

  - You are about to drop the column `data` on the `Doc` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Doc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "data",
DROP COLUMN "prompt";
