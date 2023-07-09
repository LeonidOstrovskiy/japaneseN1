import React, { useState } from 'react';

import SignUp from './SignUp';
import Login from './Login';

import PasswordReset from './PasswordReset';

const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [passwordReset, setPasswordReset] = useState<boolean>(false);

  return (
    <div className="absolute w-[300px] h-[500px] top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 shadow-magenta-1  text-text-light bg-purple-950 rounded-md shadow-lg flex flex-col justify-stretch items-center transition-all ">
      {isLogin ? <Login /> : <SignUp />}
      <p
        className="mt-8 px-2 hover:bg-text-light cursor-pointer hover:text-purple-950  "
        onClick={() => {
          setIsLogin(!isLogin);
        }}
      >
        {isLogin ? 'Not yet registrered?' : 'Go to Login'}
      </p>
      {isLogin && (
        <p
          onClick={() => setPasswordReset(true)}
          className="mt-8 px-2 hover:bg-text-light cursor-pointer hover:text-purple-950  "
        >
          I have forgotten my password{' '}
        </p>
      )}
      {passwordReset && <PasswordReset setPasswordReset={setPasswordReset} />}
    </div>
  );
};

export default AuthModal;
