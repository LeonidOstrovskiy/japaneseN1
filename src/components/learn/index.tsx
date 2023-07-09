import React, { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

type LearnTypes = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  lesson: number;
  isOutOfScreen: boolean;
  setIsOutOfScreen: React.Dispatch<React.SetStateAction<boolean>>;
  render: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
};

function getRandomNumber() {
  return Math.floor(1 + Math.random() * 51);
}

type Problem = {
  question: string;
  answer: string;
};

const Learn: React.FC<LearnTypes> = ({
  loading,
  setLoading,
  lesson,
  isOutOfScreen,
  setIsOutOfScreen,
  render,
  setRender,
}) => {
  const [problem, setProblem] = useState<Problem>({ question: '', answer: '' });

  useEffect(() => {
    const enterScreen = setTimeout(() => {
      setIsOutOfScreen(false);
    }, 400);
    return () => clearTimeout(enterScreen);
  }, [render, setIsOutOfScreen]);

  const nextLessonHandler = () => {
    setIsOutOfScreen(true);
    setRender(!render);
  };

  useEffect(() => {
    const fetchLesson = async () => {
      let itemNumber = getRandomNumber();
      let refer = lesson.toString() + itemNumber.toString();

      setLoading(true);
      try {
        let lessonRef = doc(firestore, 'vocab', refer);
        let lessonDocSnap = await getDoc(lessonRef);
        if (!lessonDocSnap.exists()) {
          console.log('not exist');
          setLoading(false);
          return;
        }
        let lessonFromDB = lessonDocSnap.data();
        setProblem({
          question: lessonFromDB.jap,
          answer: lessonFromDB.eng,
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchLesson();
  }, [setLoading, lesson, render]);

  return (
    <>
      <div className="flex justify-between items-center text-text-dark font-extrabold text-base sm:text-lg px-3 mx-1 my-4 sm:mx-8 ">
        <h4> Lesson {lesson} </h4>
        <button
          onClick={nextLessonHandler}
          className="border-4 rounded-lg border-purple-950 p-2 hover:text-purple-950 "
        >
          Next
        </button>
      </div>
      {loading && (
        <div className="w-full flex flex-col justify-center items-center ">
          <h1 className="w-full text-center text-2xl text-text-dark font-bold ">
            Loading...{' '}
          </h1>{' '}
        </div>
      )}
      {!loading && (
        <div
          className={`flex flex-col items-center gap-12 my-4 transition-all ${
            isOutOfScreen && 'absolute -translate-x-10 top-1/2 '
          } `}
        >
          <div className="flex justify-center items-center text-text-extra-dark font-extrabold mm:text-2xl text-lg my-2 transition-all ">
            {problem.question}
          </div>
          <div className=" p-6 rounded-lg text-sm mmm:text-xl mm:text-lg bg-purple-950 text-text-light transition-all ">
            {problem.answer}
          </div>
        </div>
      )}
    </>
  );
};

export default Learn;
