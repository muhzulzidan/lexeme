/*
  Warnings:

  - A unique constraint covering the columns `[settingsId]` on the table `Doc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `settingsId` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "settingsId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doc_settingsId_key" ON "Doc"("settingsId");

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
