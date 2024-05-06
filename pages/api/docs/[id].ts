// /pages/api/docs/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    console.log(id, "id");
    try {
        const doc = await prisma.doc.findUnique({ where: { id: id as string } });
        if (doc) {
            console.log("found document doc 1");
            res.status(200).json(doc);
        } else {
            console.log("Document not found");
            res.status(404).json({ error: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch document' });
    }
}