import React, {useState} from 'react';
import RegistrationForm from './subComponents/RegistrationForm';

import API from '../../helper/api';
import {Link} from 'react-router-dom';
import {Spinner} from '../../Elements';

export default function () {
  const [isLoading, setIsLoading] = useState(false);

  const authData = JSON.parse(window.localStorage.getItem('authData'));
  const isAlreadyLoggedin = authData && authData.authToken ? true : false;
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [registrationResponse, setRegistrationResponse] = useState({});

  const onSubmit = (user) => {
    setUserInfo(() => user);
    setIsLoading(true);
    API.post('/api/user/registration', user).then((res) => {
      setRegistrationResponse(() => res);
      setIsRegistered(true);
      setIsLoading(false);

      if (res.code === 201 || res.code === 200) {
        setTimeout(() => {
          window.location = '/user/login';
        }, 4000);
      }
    });
  };

  const logout = () => {
    window.localStorage.removeItem('authData');
  };

  return (
    <>
      <Spinner isLoading={isLoading} />
      {isAlreadyLoggedin ? (
        <p className='alert alert-info mx-3'>
          {`Hey ${authData && authData.name}, Seems like you're already Logged In. Please `}
          <Link onClick={logout}>
            <strong>Sign Out</strong>
          </Link>
          {' first to Create another account.'}
        </p>
      ) : (
        <RegistrationForm onSubmit={onSubmit} />
      )}
      <div className='d-flex justify-content-center mt-4'>
        {isRegistered && registrationResponse && registrationResponse.code && registrationResponse.code === 200 && (
          <p className='w-fit alert alert-success'>
            {`Hi ${userInfo.firstName}!`}
            <br />
            {`We've sent an Email to ${userInfo.email} for you to Verify the email ID.`}
            <br />
            {'Please verify the email to complete the Process. Verification token will be active for 2 hours.'}
          </p>
        )}
        {registrationResponse && registrationResponse.code && registrationResponse.code === 201 ? (
          <p className='w-fit alert alert-success'>{registrationResponse.message}</p>
        ) : registrationResponse && registrationResponse.code && registrationResponse.code !== 200 ? (
          <p className='w-fit alert alert-danger'>{registrationResponse.message}</p>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
