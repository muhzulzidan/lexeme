// /pages/api/getSettings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { docId } = req.query;

    if (!docId || typeof docId !== 'string') {
        return res.status(400).json({ error: 'Invalid docId' });
    }

    const settings = await prisma.settings.findUnique({
        where: { id: docId }, 
    });

    if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
    }

    res.status(200).json(settings);
}