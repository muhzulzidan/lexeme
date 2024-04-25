-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "apiKey" TEXT NOT NULL,
    "globalPrompt" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "actionPrompts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
