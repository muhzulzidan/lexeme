// pages/api/saveSettings.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
    const { settings, docId } = req.body;
    console.log(settings, "save settings");
    console.log(docId, "docId settings");
    await prisma.settings.upsert({
        where: { id: docId }, // Use id in the where clause
        update: settings,
        create: {
            ...settings,
            doc: {
                connect: { id: docId },
            },
        },
    });
    res.status(200).json({ message: 'Settings saved or updated successfully' });
}