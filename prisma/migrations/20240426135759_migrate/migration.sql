/*
  Warnings:

  - Added the required column `data` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "history" JSONB,
ADD COLUMN     "prompt" TEXT NOT NULL;
