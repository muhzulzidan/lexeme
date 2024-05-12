// /pages/api/createSession.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;
    try {
        const newSession = await prisma.session.create({
            data: {
                id: id,
                // Add any other session properties you need
            },
        });
        console.log('New session:', newSession);
        res.status(200).json({ id: newSession.id });  // Send simplified object
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
}