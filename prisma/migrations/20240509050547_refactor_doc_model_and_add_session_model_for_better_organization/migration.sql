/*
  Warnings:

  - You are about to drop the column `prompt` on the `Doc` table. All the data in the column will be lost.
  - The `history` column on the `Doc` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `session_id` to the `Doc` table without a default value. This is not possible if the table is not empty.
  - Made the column `data` on table `Doc` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_id_fkey";

-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "prompt",
ADD COLUMN     "session_id" TEXT NOT NULL,
ALTER COLUMN "data" SET NOT NULL,
DROP COLUMN "history",
ADD COLUMN     "history" JSONB[];

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "docId" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
