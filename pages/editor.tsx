// pages/editor.tsx
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

export const getServerSideProps: GetServerSideProps = async () => {
  const defaultData: string = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'
  const prisma = new PrismaClient();
  let docs = await prisma.doc.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (docs.length === 0) {
    // If there are no documents, create a new one
    const newDoc = {
      id: nanoid(),
      title: "Untitled",
      prompt: "",
      data: defaultData, // replace with your default data
      history: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await prisma.doc.create({ data: newDoc });
    docs = [newDoc];
  }

  // Redirect to the first document
  return {
    redirect: {
      destination: `/editor/${docs[0].id}`,
      permanent: false,
    },
  };
};

export default function Editor() {
  return <p>Loading...</p>;
}