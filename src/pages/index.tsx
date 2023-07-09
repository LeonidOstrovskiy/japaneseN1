import Topbar from '@/shared/Topbar';
import Sidebar from '@/shared/Sidebar';
import Learn from '@/components/learn';
import Test from '@/components/test';
import { useRecoilState } from 'recoil';
import { CurrentPageAtomType, currentPageState } from '@/state/Atoms';
import Link from 'next/link';
import useHasMounted from '@/hooks/useHasMounted';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export default function Home() {
  const [currentPage, setCurrentPage] =
    useRecoilState<CurrentPageAtomType>(currentPageState);

  const [lesson, setLesson] = useState<number>(0);
  const [clicked, setClicked] = useState<boolean>(false);
  const [lessonOver, setLessonOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [isOutOfScreen, setIsOutOfScreen] = useState<boolean>(true);
  const [render, setRender] = useState<boolean>(true);

  const [user] = useAuthState(auth);

  const handleOnClick = (newCurrentPage: string) => {
    setCurrentPage({
      ...currentPage,
      type:
        newCurrentPage === 'learn'
          ? 'learn'
          : newCurrentPage === 'test'
          ? 'test'
          : 'login',
    });
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) {
    return null;
  }

  return (
    <main className="bg-sea-1 w-full  min-h-screen ">
      <Topbar />
      <div className="flex w-full  ">
        <Sidebar
          setClicked={setClicked}
          lesson={lesson}
          setLesson={setLesson}
          setLessonOver={setLessonOver}
          setScore={setScore}
          setIsOutOfScreen={setIsOutOfScreen}
          setRender={setRender}
          render={render}
        />
        <div className="basis-5/6 pt-4 px-4 relative ">
          {currentPage.type === 'learn' && (
            <Learn
              loading={loading}
              setLoading={setLoading}
              lesson={lesson}
              isOutOfScreen={isOutOfScreen}
              setIsOutOfScreen={setIsOutOfScreen}
              render={render}
              setRender={setRender}
            />
          )}
          {currentPage.type === 'test' && (
            <Test
              lesson={lesson}
              setClicked={setClicked}
              clicked={clicked}
              setLessonOver={setLessonOver}
              lessonOver={lessonOver}
              loading={loading}
              setLoading={setLoading}
              score={score}
              setScore={setScore}
              isOutOfScreen={isOutOfScreen}
              setIsOutOfScreen={setIsOutOfScreen}
              render={render}
              setRender={setRender}
            />
          )}
          {currentPage.type === '' && (
            <p className="text-2xl text-purple-950 absolute top-1/4 left-1/2  transform -translate-x-1/2 -translate-y-1/2  ">
              Start learning by clicking{' '}
              <Link
                className="font-bold hover:text-text-red cursor-pointer "
                onClick={() => handleOnClick('learn')}
                href="/"
              >
                Learn
              </Link>{' '}
              or test your knowledge by clicking{' '}
              <Link
                className="font-bold hover:text-text-red cursor-pointer "
                onClick={() => handleOnClick('test')}
                href="/"
              >
                {' '}
                Test{' '}
              </Link>{' '}
              {!user && (
                <>
                  {' '}
                  <span className="px-2">You may want to </span>
                  <Link
                    className="font-bold hover:text-text-red cursor-pointer "
                    onClick={() => handleOnClick('login')}
                    href="/auth"
                  >
                    Login
                  </Link>
                  <span className="px-2">to save your progress </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
