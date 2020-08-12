import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {Input, Button} from '../../../Elements';
import config from '../../../Configuration';
import fbIcon from '../icon/facebook.png';

export default function (props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailMsg, setEmailMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const userInfo = {
    email,
    password
  };

  const checkValidation = () => {
    let focusField = '';
    if (!email) {
      setEmailMsg('Mandatory Field. Please Enter your Email.');
      focusField = focusField === '' ? 'email' : focusField;
    } else if (!emailRegEx.test(email)) {
      setEmailMsg('Incorrect format. Please check and correct your Email.');
      focusField = focusField === '' ? 'email' : focusField;
    }
    if (!password) {
      setPasswordMsg('Mandatory Field. Please Enter your Password.');
      focusField = focusField === '' ? 'password' : focusField;
    }
    if (focusField && document.getElementById(focusField)) {
      document.getElementById(focusField).focus();
    }
    return focusField === '';
  };

  return (
    <div className='login'>
      <div className='d-flex justify-content-center'>
        <div className='col-12 col-md-6'>
          <h3 className='mb-3'>Log In</h3>
          <Input
            id='email'
            labelData='* Email'
            labelClass='text-grey pt-2px'
            valueData={email}
            valueClass='pl-95px'
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailMsg('');
              props.setLoginError(null);
            }}
            errMessage={emailMsg}
          />
          <Input
            id='password'
            wrapClass='mb-1'
            valueType='password'
            labelData='* Password'
            labelClass='text-grey pt-2px'
            valueData={password}
            valueClass='pl-95px'
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordMsg('');
              props.setLoginError(null);
            }}
            errMessage={passwordMsg}
          />
          <div className='d-flex justify-content-end'>
            <div className='text-right'>
              <Link className='fs-smaller' to='/forgot/password'>
                <i>Forgot your password ?</i>
              </Link>
              <div className='d-flex'>
                <Button
                  buttonLabel={
                    <span className='d-flex align-items-center social-login'>
                      <img src={fbIcon} className='mr-1 social-icon' /> login
                    </span>
                  }
                  buttonClass='box btn btn-primary w-100 mt-1 mx-2 '
                  onClick={() => (window.location = `${config.API_BASE_URL}/auth/facebook`)}
                />
                <Button
                  buttonLabel='Log In'
                  buttonClass='box btn btn-primary w-100 mt-1'
                  onClick={() => {
                    if (checkValidation()) {
                      props.onSubmit(userInfo);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center mt-4'>
        {props.isLoggedError && <p className='alert alert-danger w-fit'>{props.isLoggedError}</p>}
      </div>
    </div>
  );
}
