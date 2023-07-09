import { auth } from '@/firebase/config';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

function createButtonArray() {
  const TOTAL_LESSONS = 50;
  const BUTTON_ARRAY = [];
  for (let i = 0; i < TOTAL_LESSONS; i++) {
    BUTTON_ARRAY.push(i + 1);
  }
  return BUTTON_ARRAY;
}

type SidebarType = {
  lesson: number;
  setLesson: React.Dispatch<React.SetStateAction<number>>;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setLessonOver: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setIsOutOfScreen: React.Dispatch<React.SetStateAction<boolean>>;
  render: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarType> = ({
  lesson,
  setLesson,
  setClicked,
  setLessonOver,
  setScore,
  setIsOutOfScreen,
  render,
  setRender,
}) => {
  const buttonArray = createButtonArray();
  const [user] = useAuthState(auth);

  const changeLessonHandler = async (num: number) => {
    setLesson(num);
    localStorage.setItem('lesson', JSON.stringify(num));
    setClicked(false);
    setLessonOver(false);
    setIsOutOfScreen(true);
    setRender(!render);
    if (!user) {
      setScore(0);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      if (localStorage.getItem('lesson')) {
        let lessonFromLocalStorage = localStorage.getItem('lesson');
        if (lessonFromLocalStorage) {
          lessonFromLocalStorage = JSON.parse(lessonFromLocalStorage);
          setLesson(Number(lessonFromLocalStorage));
        }
      }
    }
  }, [setLesson]);

  return (
    <div className="basis-1/6 flex flex-col items-center px-2 py-2 gap-1 sm:text-base text-mm">
      <h3 className="text-lg text-purple-950 font-bold ">Lessons</h3>
      {buttonArray.map((num) => (
        <button
          className={`w-full  rounded-lg  hover:text-purple-950 hover:bg-text-light transition-all
          ${
            lesson === num
              ? 'text-text-red font-bold bg-text-dark '
              : 'bg-purple-950 text-text-light'
          } 
          `}
          key={num}
          onClick={() => changeLessonHandler(num)}
        >
          {num}{' '}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
