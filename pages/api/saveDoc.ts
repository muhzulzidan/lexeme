// /pages/api/saveDoc.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body, "save doc api");
    if (req.method === 'POST') {
        const doc = req.body;
        try {
            const updatedDoc = await prisma.doc.upsert({
                where: { id: doc.id },
                update: {
                    title: doc.title,
                    data: doc.data,
                    history: doc.history,
                    updatedAt: new Date(doc.updatedAt)
                },
                create: {
                    id: doc.id,
                    title: doc.title,
                    data: doc.data,
                    history: doc.history,
                    createdAt: new Date(doc.createdAt),
                    updatedAt: new Date(doc.updatedAt)
                },
            });
            res.status(200).json(updatedDoc);
        } catch (error) {
            res.status(500).json({ error: 'Failed to save document' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}