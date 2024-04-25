// pages/api/saveDocs.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
    const docs = req.body.docs;
    console.log(docs, "save docs");
    for (const doc of docs) {
        await prisma.doc.upsert({
            where: { id: doc.id },
            update: { title: doc.title },
            create: {
                id: doc.id,
                title: doc.title,
            },
        });
    }
    res.status(200).json({ message: 'Docs saved or updated successfully' });
}