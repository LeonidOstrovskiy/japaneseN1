import React, { useEffect, useState } from 'react';
import { auth } from '@/firebase/config';
// import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { CurrentPageAtomType, currentPageState } from '@/state/Atoms';

const Login: React.FC = () => {
  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  const [currentPage, setCurrentPage] =
    useRecoilState<CurrentPageAtomType>(currentPageState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const hanldeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValues.email || !inputValues.password) {
      setIsError(true);
    }
    if (isError) {
      return;
    }

    const signedInUser = await signInWithEmailAndPassword(
      inputValues.email,
      inputValues.password
    );
    if (!signedInUser) {
      return;
    }
    setCurrentPage({ ...currentPage, type: 'learn' });
    router.push('/');
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
      <h2 className="text-xl mb-4 mt-2 "> Login </h2>
      <form
        onSubmit={hanldeSubmit}
        className="flex flex-col justify-stretch items-center "
      >
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
          className="border-2 outline-none pl-2 focus:border-text-red rounded-sm "
        />
        {isError && inputValues.password === '' && (
          <p className="text-text-red ">Please provide a password</p>
        )}

        <button
          type="submit"
          className="w-full rounded-sm border-2 mt-8 h-8 flex items-center justify-center cursor-pointer hover:text-purple-950 hover:bg-text-light "
        >
          {' '}
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
