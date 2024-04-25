/*
  Warnings:

  - The primary key for the `Doc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `Doc` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Setting" DROP CONSTRAINT "Setting_sessionId_fkey";

-- AlterTable
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_pkey",
DROP COLUMN "content",
ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Doc_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Doc_id_seq";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Setting";
