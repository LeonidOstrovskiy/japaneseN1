import { auth } from '@/firebase/config';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

type PasswordResetType = {
  setPasswordReset: React.Dispatch<React.SetStateAction<boolean>>;
};

const PasswordReset: React.FC<PasswordResetType> = ({ setPasswordReset }) => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sent = await sendPasswordResetEmail(email);
    if (sent) {
      setSuccess(true);
    }
  };

  if (sending) {
    return (
      <div className="w-full h-full absolute top-0 left-0 pt-12 pl-8 font-bold transition-all z-3 flex items-center bg-sea-2 text-center text-3xl text-purple-950 ">
        Sending email...
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full h-full absolute justify-stretch gap-12 flex-col top-0 left-0 pt-12  font-bold transition-all z-10 flex items-center bg-sea-2 text-center text-3xl text-purple-950 ">
        <div
          onClick={() => setPasswordReset(false)}
          className="w-full text-center text-3xl font-extrabold cursor-pointer   hover:text-text-red "
        >
          X
        </div>
        <h3> Check your email! </h3>
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute top-0 left-0 transition-all z-10 flex flex-col items-center justify-between bg-sea-2 ">
      <div
        onClick={() => setPasswordReset(false)}
        className="w-full text-right text-3xl font-extrabold cursor-pointer basis-1/12 p-4 hover:text-text-red "
      >
        X
      </div>
      <form
        className=" space-y-6 basis-11/12  text-xl "
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="block mb-4 mt-2 ">
          {' '}
          Your email{' '}
        </label>
        <input
          className="border-2 outline-none pl-2 leading-6 py-1 focus:border-text-light rounded-sm "
          type="email"
          name="email"
          id="email"
          placeholder="...email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <p className="text-text-red text-xxl font-extrabold ">
            {' '}
            {error.message}{' '}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-sm border-2 pb-1 mt-8 h-10 flex items-center justify-center cursor-pointer hover:text-purple-950 hover:bg-text-light "
        >
          Reset password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
