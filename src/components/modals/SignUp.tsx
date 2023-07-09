import React, { useEffect, useState } from 'react';
import { auth, firestore } from '@/firebase/config';
// import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { CurrentPageAtomType, currentPageState } from '@/state/Atoms';

//import useSetCurrentPage from '@/hooks/useSetCurrentPage';

function createLessonsArray() {
  const TOTAL_LESSONS = 50;
  const LESSON_ARRAY = [];
  for (let i = 0; i < TOTAL_LESSONS; i++) {
    LESSON_ARRAY.push({ lesson: i + 1, learned: [] });
  }
  return LESSON_ARRAY;
}

const SignUp: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] =
    useRecoilState<CurrentPageAtomType>(currentPageState);

  const [isError, setIsError] = useState(false);

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const hanldeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValues.email || !inputValues.password || !inputValues.name) {
      setIsError(true);
      return;
    }

    try {
      const registeredUser = await createUserWithEmailAndPassword(
        inputValues.email,
        inputValues.password
      );
      if (!registeredUser) {
        return;
      }
      console.log(registeredUser);
      const userDoc = doc(firestore, 'users', registeredUser.user.uid);
      await setDoc(userDoc, {
        uid: registeredUser.user.uid,
        name: inputValues.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lessons: createLessonsArray(),
        currentLesson: 1,
      });
      setCurrentPage({ ...currentPage, type: 'learn' });
      router.push('/');
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2 className="text-xl mb-4 mt-2 "> Sign Up </h2>
      <form
        onSubmit={hanldeSubmit}
        className="flex flex-col justify-stretch items-center "
      >
        <label htmlFor="name" className="block mb-4 mt-2 ">
          Nickname:
        </label>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          placeholder="...name"
          id="name"
          className="border-2 outline-none pl-2 focus:border-text-red rounded-sm text-purple-950 "
        />
        {isError && inputValues.name === '' && (
          <p className="text-text-red "> Please provide any name </p>
        )}

        <label htmlFor="name" className="block mb-4 mt-2 ">
          Email:
        </label>
        <input
          onChange={handleChange}
          type="email"
          name="email"
          placeholder="...email"
          id="email"
          className="border-2 outline-none pl-2 focus:border-text-red rounded-sm text-purple-950 "
        />
        {isError && inputValues.email === '' && (
          <p className="text-text-red "> Please provide an email </p>
        )}
        <label htmlFor="password" className="block mb-4 mt-2 ">
          Password:
        </label>
        <input
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="...password"
          id="password"
          className="border-2 outline-none pl-2 focus:border-text-red rounded-sm text-purple-950 "
        />
        {isError && inputValues.password === '' && (
          <p className="text-text-red ">Please provide a password</p>
        )}

        <button
          type="submit"
          className="w-full rounded-sm border-2 mt-8 h-8 flex items-center justify-center cursor-pointer hover:text-purple-950 hover:bg-text-light "
        >
          {' '}
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUp;
