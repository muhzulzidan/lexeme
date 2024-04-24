/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Setting_sessionId_key" ON "Setting"("sessionId");
