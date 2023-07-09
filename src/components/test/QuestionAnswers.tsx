'use client';

import React, { useState } from 'react';
import { firestore, auth } from '@/firebase/config';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

type Props = {
  problem: {
    question: string;
    correctAnswer: string;
    allAnswers: [];
    problemRef: string;
  };
  clicked: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
  lesson: number;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
};

const QuestionAnswers: React.FC<Props> = ({
  problem,
  clicked,
  setClicked,
  lesson,
  score,
  setScore,
}) => {
  // console.log(problem);

  const [user] = useAuthState(auth);

  const [correct, setCorrect] = useState<boolean>(false);

  const clickHandler = async (
    e: React.MouseEvent<HTMLDivElement>,
    answer: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (clicked) {
      return;
    }
    setClicked(true);
    //  console.log(answer);
    if (answer === problem.correctAnswer) {
      setCorrect(true);
      setScore(score + 1);
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            // console.log(userData);
            // console.log(userData.lessons[lesson - 1]);
            //
            // console.log(problem.problemRef);
            const currentLesson = userData.lessons[lesson - 1];
            currentLesson.learned.push(problem.problemRef);
            // console.log(currentLesson);
            const newLessons = userData.lessons.map(
              (les: { lesson: number; learned: [string] }) =>
                les.lesson === lesson ? currentLesson : les
            );

            // console.log(newLessons);
            await updateDoc(userRef, { lessons: newLessons });
          } else {
            console.log('no such user');
          }
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      setCorrect(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center text-text-extra-dark font-extrabold mm:text-2xl text-lg my-2 transition-all ">
        {problem.question}
      </div>
      <div className="mm:grid  mm:grid-cols-2  flex flex-col gap-3  ">
        {problem.allAnswers.map((answer, index) => (
          <div
            className={`${!clicked && 'bg-purple-950 text-text-light '}
            ${
              clicked &&
              correct &&
              answer === problem.correctAnswer &&
              'text-sea-2 bg-text-extra-dark font-bold '
            }  
            ${
              clicked &&
              answer !== problem.correctAnswer &&
              'text-text-orange bg-text-dark '
            } 
            ${
              clicked &&
              !correct &&
              answer === problem.correctAnswer &&
              'border-text-red text-text-red bg-purple-950 '
            }
            p-6 rounded-lg text-sm mmm:text-xl mm:text-lg cursor-pointer transition-all`}
            key={index}
            onClick={(e) => clickHandler(e, answer)}
          >
            {answer}
          </div>
        ))}
      </div>
    </>
  );
};

export default QuestionAnswers;
