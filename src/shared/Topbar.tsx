import { auth } from '@/firebase/config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { firestore } from '@/firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { CurrentPageAtomType, currentPageState } from '@/state/Atoms';
import { useRecoilState } from 'recoil';

const Topbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [displayName, setDisplayName] = useState<string>('');

  const [currentPage, setCurrentPage] =
    useRecoilState<CurrentPageAtomType>(currentPageState);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const handleSignOut = async () => {
    setCurrentPage({ ...currentPage, type: 'learn' });
    await signOut(auth);
  };

  useEffect(() => {
    const getUserFromDb = async () => {
      if (!user) {
        return;
      }
      try {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          console.log('no such user');
          return;
        }
        const userDoc = userSnapshot.data();
        // console.log(userDoc);
        setDisplayName(userDoc.name);
      } catch (err) {
        console.log(err);
      }
    };
    getUserFromDb();
  }, [user]);

  return (
    <div className="w-full h-[50px] text-sm sm:text-xl px-4 flex shrink-0 justify-between items-center relative shadow-lg shadow-magenta-1  text-text-light bg-purple-950 ">
      <Link
        href="/"
        className={`hover:text-text-red transition-all ${
          currentPage.type === 'learn' && 'text-text-orange '
        } `}
        onClick={() => setCurrentPage({ ...currentPage, type: 'learn' })}
      >
        Learn{' '}
      </Link>
      <Link
        href="/"
        className={`hover:text-text-red transition-all ${
          currentPage.type === 'test' && 'text-text-orange '
        } `}
        onClick={() => setCurrentPage({ ...currentPage, type: 'test' })}
      >
        {' '}
        Test{' '}
      </Link>
      {!user && (
        <Link
          href="/auth"
          className={`hover:text-text-red ${
            currentPage.type === 'login' && 'text-text-orange '
          } `}
          onClick={() => {
            setCurrentPage({ ...currentPage, type: 'login' });
          }}
        >
          Login
        </Link>
      )}
      {user && (
        <>
          {' '}
          <div className="text-sea-1 font-extrabold "> {displayName}</div>{' '}
          <div
            className="hover:text-text-red cursor-pointer transition-all "
            onClick={handleSignOut}
          >
            {' '}
            Logout{' '}
          </div>{' '}
        </>
      )}
    </div>
  );
};

export default Topbar;
