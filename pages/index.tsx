import React, { useState } from 'react';
import Notes from './notes';
import { Note } from '@prisma/client';
import { getSession, useSession } from 'next-auth/react';
import Login from '../components/login';
import prisma from '../lib/prismadb';

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    const notes = await prisma.note.findMany({
      where: {
        userId: user?.id,
      },
    });
    
    return {
      props: {
        notesFromDB: notes,
      },
    };
  } catch (error) {
    const notes = null;

    return {
      props: {
        notesFromDB: notes,
      },
    };
  }
}

// export async function getServerSideProps(context: any) {
//   const session = await getSession(context);

//   try {
//     const users = await prisma.note.create({
//       data: {
//         userId: 'clbyd8rz20000tzzgehlntsee',
//         title: 'a',
//         note: 'a'
//       },
//     });
    
//     const user = await prisma.user.findFirst({
//       where: {
//         email: session?.user?.email,
//       },
//     });

//     const notes = await prisma.note.findMany({
//       where: {
//         userId: user?.id,
//       },
//     });
    
//     return {
//       props: {
//         notesFromDB: notes,
//       },
//     };

//   } catch (error) {
//     const notes = null;

//     return {
//       props: {
//         notesFromDB: notes,
//       },
//     };
//   }
// }

const index = ({ notesFromDB }: { notesFromDB: any }) => {
  const [notes, setNotes] = useState<Note[]>(notesFromDB);
  const { data: session, status: sesh } = useSession();

  if (sesh === 'loading') {
    return null;
  }

  if (sesh === 'unauthenticated') {
    return <Login />;
  }

  return <Notes notes={notes} />;
};

export default index;
