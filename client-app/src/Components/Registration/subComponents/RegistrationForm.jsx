import React, {useState} from 'react';

import {Input} from '../../../Elements';

export default function (props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('Dublin');
    const [postalCode, setPostalCode] = useState('');

    const [firstNameMsg, setFirstNameMsg] = useState('');
    const [lastNameMsg, setLastNameMsg] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [addressLine1Msg, setAddressLine1Msg] = useState('');
    const [postalCodeMsg, setPostalCodeMsg] = useState('');

    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const irePostCodeRegEx = /^[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}$/;

    const userInfo = {
        firstName,
        lastName,
        email,
        addressLine1,
        addressLine2,
        postalCode,
        city,
        country: 'Ireland',
        password
    };

    const checkValidation = () => {
        let focusField = '';
        if (!firstName) {
            setFirstNameMsg('Mandatory Field. Please Enter your First Name.');
            focusField = focusField === '' ? 'firstName' : focusField;
        }
        if (!lastName) {
            setLastNameMsg('Mandatory Field. Please Enter your Last Name.');
            focusField = focusField === '' ? 'lastName' : focusField;
        }
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
        if (!addressLine1) {
            setAddressLine1Msg('Mandatory Field. Please Enter your Address.');
            focusField = focusField === '' ? 'addressLine1' : focusField;
        }
        if (!postalCode) {
            setPostalCodeMsg('Mandatory Field. Please Enter your Postal code.');
            focusField = focusField === '' ? 'postalCode' : focusField;
        } else if (!irePostCodeRegEx.test(postalCode)) {
            setPostalCodeMsg('Incorrect format. Please check and correct your Postal code.');
            focusField = focusField === '' ? 'postalCode' : focusField;
        }

        if (focusField && document.getElementById(focusField)) {
            document.getElementById(focusField).focus();
        }
        return focusField === '';
    };

    return (
        <div className='registration'>
            <h3>Registration</h3>
            <div className='d-flex justify-content-center'>
                <div className='col-12 col-md-6'>
                    <div className='d-flex justify-content-start'>
                        <span className='font-italic font-smaller text-grey'>
                            Please fill in your details. [ * marks mandatory fields]
                        </span>
                    </div>
                    <Input
                        id='firstName'
                        labelData='* First Name'
                        labelClass='text-grey pt-2px'
                        valueData={firstName}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setFirstName(event.target.value);
                            setFirstNameMsg('');
                        }}
                        errMessage={firstNameMsg}
                    />
                    <Input
                        id='lastName'
                        labelData='* Last Name'
                        labelClass='text-grey pt-2px'
                        valueData={lastName}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setLastName(event.target.value);
                            setLastNameMsg('');
                        }}
                        errMessage={lastNameMsg}
                    />
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
                    <Input
                        id='addressLine1'
                        labelData='* Address'
                        labelClass='text-grey pt-2px'
                        valueData={addressLine1}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setAddressLine1(event.target.value);
                            setAddressLine1Msg('');
                        }}
                        errMessage={addressLine1Msg}
                    />
                    <Input
                        id='addressLine2'
                        labelData='Address cont.'
                        labelClass='text-grey pt-2px'
                        valueData={addressLine2}
                        valueClass='pl-115px'
                        onChange={(event) => setAddressLine2(event.target.value)}
                    />
                    <Input
                        id='postalCode'
                        labelData='* Postal Code'
                        labelClass='text-grey pt-2px'
                        valueData={postalCode.toUpperCase()}
                        valueClass='pl-115px'
                        onChange={(event) => {
                            setPostalCode(event.target.value);
                            setPostalCodeMsg('');
                        }}
                        errMessage={postalCodeMsg}
                    />
                    <Input
                        id='city'
                        labelData='City'
                        labelClass='text-grey pt-2px'
                        valueData={city}
                        valueClass='pl-115px'
                        onChange={(event) => setCity(event.target.value)}
                    />
                    <Input
                        id='country'
                        isDisabled={true}
                        labelData='Country'
                        labelClass='text-grey pt-2px'
                        valueData='Ireland'
                        valueClass='pl-115px'
                    />
                    <div className='d-flex justify-content-end'>
                        <button
                            className='col-12 col-md-4 box btn btn-primary'
                            onClick={() => {
                                if (checkValidation()) {
                                    props.onSubmit(userInfo);
                                }
                            }}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
