// /pages/api/createDoc.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body, "create doc api");
    if (req.method === 'POST') {
        const doc = req.body;
        try {
            const newDoc = await prisma.doc.create({
                data: {
                    id: doc.id,
                    title: doc.title,
                    data: doc.data,
                    history: doc.history,
                    createdAt: new Date(doc.createdAt),
                    updatedAt: new Date(doc.updatedAt)
                },
            });
            res.status(200).json(newDoc);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create document' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}