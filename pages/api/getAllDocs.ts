// /pages/api/getAllDocs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const docs = await prisma.doc.findMany();
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
}