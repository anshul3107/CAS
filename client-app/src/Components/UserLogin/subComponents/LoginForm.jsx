import React, {useState} from 'react';

import {Input} from '../../../Elements';

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
            <h3>Login</h3>
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-6'>
                    <div className='d-flex justify-content-start'>
                        <span className='font-italic font-smaller text-grey'>
                            Please fill in your details. [ * marks mandatory fields]
                        </span>
                    </div>
                    <Input
                        id='email'
                        labelData='* Email'
                        labelClass='text-grey pt-2px'
                        valueData={email}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setEmailMsg('');
                        }}
                        errMessage={emailMsg}
                    />
                    <Input
                        id='password'
                        valueType='password'
                        labelData='* Password'
                        labelClass='text-grey pt-2px'
                        valueData={password}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        errMessage={passwordMsg}
                    />
                    <div className='d-flex justify-content-end'>
                        <button
                            className='col-12 col-md-4 box btn btn-primary'
                            onClick={() => {
                                if (checkValidation()) {
                                    props.onSubmit(userInfo);
                                }
                            }}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
