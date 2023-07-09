'use client';

import React, { useState, useEffect } from 'react';

import { firestore, auth } from '@/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import QuestionAnswers from './QuestionAnswers';

function getRandomNumber() {
  return Math.floor(1 + Math.random() * 51);
}

const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

type TestType = {
  lesson: number;
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setLessonOver: React.Dispatch<React.SetStateAction<boolean>>;
  lessonOver: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  isOutOfScreen: boolean;
  setIsOutOfScreen: React.Dispatch<React.SetStateAction<boolean>>;
  render: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ProblemType = {
  question: string;
  correctAnswer: string;
  allAnswers: [];
  problemRef: string;
};

const Test: React.FC<TestType> = ({
  lesson,
  clicked,
  setClicked,
  lessonOver,
  setLessonOver,
  loading,
  setLoading,
  score,
  setScore,
  isOutOfScreen,
  setIsOutOfScreen,
  render,
  setRender,
}) => {
  const [user] = useAuthState(auth);

  const [problem, setProblem] = useState<ProblemType>({
    question: '',
    correctAnswer: '',
    allAnswers: [],
    problemRef: '',
  });

  useEffect(() => {
    const enterScreen = setTimeout(() => {
      setIsOutOfScreen(false);
    }, 400);

    return () => clearTimeout(enterScreen);
  }, [render, setIsOutOfScreen]);

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonNumber = lesson;
      let itemNumber = getRandomNumber();
      let refer = lessonNumber.toString() + itemNumber.toString();
      setLoading(true);
      try {
        if (user) {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const solvedProblems = userData.lessons[lesson - 1].learned;
            setScore(solvedProblems.length);

            if (solvedProblems.length <= 50) {
              let questionNotChosen = solvedProblems.includes(refer);
              while (questionNotChosen) {
                itemNumber = getRandomNumber();
                refer = lessonNumber.toString() + itemNumber.toString();
                questionNotChosen = solvedProblems.includes(refer);
              }
            } else {
              setLessonOver(true);
              setLoading(false);
              return;
            }
          } else {
            console.log('no such user');
          }
        }
      } catch (err) {
        console.log(err);
      }
      // console.log(refer);
      let existingItemNrs = [itemNumber];
      try {
        let lessonRef = doc(firestore, 'vocab', refer);
        let lessonDocSnap = await getDoc(lessonRef);
        if (!lessonDocSnap.exists()) {
          setLoading(false);
          return;
        }
        let lessonFromDB = lessonDocSnap.data();
        // console.log(lessonFromDB);

        const currentQuestion = lessonFromDB.jap;
        const currentCorrectAnswer = lessonFromDB.eng;
        let currentAllAnswers = [currentCorrectAnswer];

        while (currentAllAnswers.length < 4) {
          let newItemNr = getRandomNumber();
          if (!existingItemNrs.includes(newItemNr)) {
            existingItemNrs.push(newItemNr);
            refer = lessonNumber.toString() + newItemNr.toString();

            lessonRef = doc(firestore, 'vocab', refer);
            lessonDocSnap = await getDoc(lessonRef);
            if (lessonDocSnap.exists()) {
              lessonFromDB = lessonDocSnap.data();

              currentAllAnswers.push(lessonFromDB.eng);
            }
          }
        }

        const randomNumbersArray = shuffleArray([0, 1, 2, 3]);

        const shuffledAnswers = randomNumbersArray.map(
          (item: number) => currentAllAnswers[item]
        );

        setProblem({
          question: currentQuestion,
          correctAnswer: currentCorrectAnswer,
          allAnswers: shuffledAnswers,
          problemRef: lessonNumber.toString() + itemNumber.toString(),
        });
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [lesson, render, user, setLessonOver, setLoading, setScore]);

  const nextLessonHandler = async () => {
    setIsOutOfScreen(true);
    setRender(!render);

    setClicked(false);
  };

  const handleReset = async () => {
    if (!user) {
      return;
    }
    const userRef = doc(firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return;
    }
    const userData = userSnap.data();

    const newLessons = userData.lessons.map(
      (les: { lesson: number; learned: [string] }) =>
        les.lesson === lesson ? { ...les, learned: [] } : les
    );

    await updateDoc(userRef, { lessons: newLessons });
    setClicked(false);
    setScore(0);
    setLessonOver(false);
  };

  return (
    <>
      <div className="flex justify-between items-center text-text-dark font-extrabold text-base sm:text-lg px-3 mx-1  sm:mx-8 ">
        <h4> Lesson {lesson} </h4>
        <button
          onClick={nextLessonHandler}
          className="border-4 rounded-lg border-purple-950 p-2 hover:text-purple-950 "
        >
          {' '}
          Next{' '}
        </button>
      </div>
      <div className="sm:text-center text-left text-purple-950 text-lg font-bold py-3 ">
        Score: <span className="px-2  text-text-red "> {score} </span>
      </div>
      {!lessonOver && !loading && (
        <div
          className={`flex flex-col items-center gap-3 transition-all ${
            isOutOfScreen && 'absolute -translate-x-10 top-1/2 '
          } `}
        >
          <QuestionAnswers
            problem={problem}
            clicked={clicked}
            setClicked={setClicked}
            lesson={lesson}
            setScore={setScore}
            score={score}
          />{' '}
        </div>
      )}
      {loading && (
        <div className="w-full flex flex-col justify-center items-center ">
          <h1 className="w-full text-center text-2xl text-text-dark font-bold ">
            Loading...{' '}
          </h1>{' '}
        </div>
      )}
      {lessonOver && (
        <div className="w-full flex flex-col justify-center items-center ">
          {' '}
          <h1 className="w-full text-center text-2xl text-text-dark font-bold ">
            {' '}
            You answered all questions! You can always reset your score to zero
            and practice again
          </h1>
          <button
            onClick={handleReset}
            className="text-2xl text-text-red font-bold my-4 border-2 border-text-red p-4 rounded-lg hover:bg-text-red hover:text-sea-1 "
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
};

export default Test;
