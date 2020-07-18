import React, {useState} from 'react';
import LoginForm from './subComponents/LoginForm';

import API from '../../helper/api';
import {Link} from 'react-router-dom';
import {Spinner} from '../../Elements';

export default function () {
  const [isLoading, setIsLoading] = useState(false);

  const authData = JSON.parse(window.localStorage.getItem('authData'));
  const isAlreadyLoggedin = authData && authData.authToken ? true : false;
  const [isLoggedError, setLoginError] = useState(null);

  const onSubmit = (user) => {
    setIsLoading(true);
    API.post('/auth/token', user).then((res) => {
      if (res.authToken) {
        window.localStorage.setItem('authData', JSON.stringify(res));
        window.location.pathname = '/order/new';
      } else {
        setLoginError(res.message);
      }
      setIsLoading(false);
    });
  };

  return (
    <>
      <Spinner isLoading={isLoading} />
      {isAlreadyLoggedin ? (
        <p className='alert alert-info mx-3'>
          {`Hey ${authData && authData.name}, Seems like you're already Logged In. Please `}
          <Link
            to='/user/login'
            onClick={() => {
              window.localStorage.removeItem('authData');
            }}>
            <strong>Sign Out</strong>
          </Link>
          {' first to login with another account.'}
        </p>
      ) : (
        <>
          <LoginForm onSubmit={onSubmit} isLoggedError={isLoggedError} setLoginError={setLoginError} />
        </>
      )}
    </>
  );
}
