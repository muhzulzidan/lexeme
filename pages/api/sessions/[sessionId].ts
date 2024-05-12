// /pages/api/sessions/[sessionId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { sessionId } = req.query;
    console.log(sessionId, "sessionId sessionss");
    try {
        const docs = await prisma.doc.findMany({ where: { sessionId: sessionId as string } });
        if (docs) {
            console.log("found documents");
            res.status(200).json(docs);
        } else {
            console.log("No documents found for this session");
            res.status(404).json({ error: 'No documents found for this session' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
}