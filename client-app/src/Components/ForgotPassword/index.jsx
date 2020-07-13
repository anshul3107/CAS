import React, {useState} from 'react';

import {Spinner, Input, Button} from '../../Elements';
import API from '../../helper/api';

export default function () {
    const [email, setEmail] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [forgotPasswordResponse, setForgotPasswordResponse] = useState('');

    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const forgotPassword = () => {
        setIsLoading(true);
        API.get(`/api/user/forget-password?email=${email}`).then((res) => {
            if (res.code === 200) {
                setForgotPasswordResponse(res.message);
                setErrMsg('');
            }
            if (res.code !== 200) {
                setForgotPasswordResponse('');
                setErrMsg(res.message);
            }
            setIsLoading(false);
        });
    };

    const checkValidation = () => {
        let focusField = '';
        if (!email) {
            setErrMsg('Mandatory Field. Please Enter your Email.');
            focusField = focusField === '' ? 'email' : focusField;
        } else if (!emailRegEx.test(email)) {
            setErrMsg('Incorrect format. Please check and correct your Email.');
            focusField = focusField === '' ? 'email' : focusField;
        }

        if (focusField && document.getElementById(focusField)) {
            document.getElementById(focusField).focus();
        }
        return focusField === '';
    };

    return (
        <div className='forgot-password'>
            <Spinner isLoading={isLoading} />
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-6'>
                    <h3 className='mb-3'>Reset Password</h3>
                    <Input
                        id='email'
                        labelData='* Email'
                        labelClass='text-grey pt-2px'
                        valueData={email}
                        valueClass='pl-75px'
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setErrMsg('');
                        }}
                    />
                    <div className='d-flex justify-content-end'>
                        <Button
                            buttonLabel='Submit'
                            buttonClass='col-12 col-md-4 box btn btn-primary'
                            onClick={() => {
                                if (checkValidation()) {
                                    forgotPassword();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center mt-4'>
                {forgotPasswordResponse && <p className='alert alert-success w-fit'>{forgotPasswordResponse}</p>}
            </div>
            <div className='d-flex justify-content-center mt-4'>
                {errMsg && <p className='alert alert-danger w-fit'>{errMsg}</p>}
            </div>
        </div>
    );
}
