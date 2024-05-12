// /pages/api/saveDoc.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // console.log(req.body, "save doc api");
    if (req.method === 'POST') {
        const doc = req.body;
        console.log(req.body); // Log the request body to check the sessionId

        // Check if sessionId is undefined
        const sessionConnect = doc.sessionId ? { connect: { id: doc.sessionId } } : undefined;

        try {
            const updatedDoc = await prisma.doc.upsert({
                where: { id: doc.id },
                update: {
                    title: doc.title,
                    data: doc.data,
                    history: doc.history,
                    updatedAt: new Date(doc.updatedAt),
                    session: sessionConnect,
                },
                create: {
                    session: sessionConnect,
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
            console.error('Error:', error);
            res.status(500).json({ error: 'Failed to save document' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}