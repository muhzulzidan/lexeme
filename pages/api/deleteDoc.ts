// /pages/api/deleteDoc.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { docId } = req.query;
    
    console.log(docId, "docId delete");
    
    if (!docId || typeof docId !== 'string') {
        return res.status(400).json({ error: 'Invalid docId' });
    }

    try {
        await prisma.doc.delete({
            where: { id: docId },
        });
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
    }
}