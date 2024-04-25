/*
  Warnings:

  - You are about to drop the column `settingsId` on the `Doc` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[docId]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `docId` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_settingsId_fkey";

-- DropIndex
DROP INDEX "Doc_settingsId_key";

-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "settingsId";

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "docId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Settings_docId_key" ON "Settings"("docId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
