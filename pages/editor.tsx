// pages/editor.tsx
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  const docs = await prisma.doc.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (docs.length === 0) {
    // If there are no documents, don't redirect
    return { props: {} };
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