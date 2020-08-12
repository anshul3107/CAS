import React, {useState, useEffect} from 'react';

import {Input, Dropdown, Spinner} from '../../Elements';
import API from '../../helper/api';

export default function (props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState([]);
  const [cityLocation, setCityLocation] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(null);
  const [socialProfile, setSocialProfile] = useState({});

  const [passwordMsg, setPasswordMsg] = useState('');
  const [addressLine1Msg, setAddressLine1Msg] = useState('');
  const [postalCodeMsg, setPostalCodeMsg] = useState('');
  const [phoneNumberMsg, setPhoneNumberMsg] = useState('');

  const irePostCodeRegEx = /^[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}$/;
  const countryISO3 = 'IRL';

  useEffect(() => {
    setIsLoading(true);
    API.get('/auth/socialUserData').then((res) => {
      if (res.isExisting) {
        window.localStorage.setItem(
          'authData',
          JSON.stringify({
            name: res.firstName,
            email: res.email,
            authToken: res.authToken
          })
        );
        window.location = '/order/new';
      } else {
        setSocialProfile(res);
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setEmail(res.email);
      }
    });

    API.post('https://buymeservice.azurewebsites.net/api/v1/users/authenticate', {
      email: 'x19192304@student.ncirl.ie',
      password: 'x19192304'
    })
      .then((res) => {
        API.get('https://buymeservice.azurewebsites.net/api/v1/cities/' + countryISO3, {
          Authorization: 'Bearer ' + res.token
        }).then((res) => {
          setIsLoading(false);
          setCity({
            label: res[0].name,
            value: `${res[0].name};${res[0].lat},${res[0].long}`
          });
          setCityLocation(`${res[0].lat},${res[0].long}`);
          setCityList(() =>
            res.map((city) => {
              return {
                label: city.name,
                value: `${city.name};${city.lat},${city.long}`
              };
            })
          );
        });
      })
      .catch(() => {
        API.get('/api/cityList').then((res) => {
          setIsLoading(false);
          setCity({
            label: res[0].name,
            value: `${res[0].name};${res[0].lat},${res[0].long}`
          });
          setCityLocation(`${res[0].lat},${res[0].long}`);
          setCityList(() =>
            res.map((city) => {
              return {
                label: city.name,
                value: `${city.name};${city.lat},${city.long}`
              };
            })
          );
        });
      });
  }, []);

  const onSubmit = (user) => {
    setIsLoading(true);
    API.post('/api/user/registration', user).then((res) => {
      setIsLoading(false);

      if (res.code === 201 || res.code === 200) {
        window.localStorage.setItem(
          'authData',
          JSON.stringify({
            name: socialProfile.firstName,
            email: socialProfile.email,
            authToken: socialProfile.authToken
          })
        );
        setTimeout(() => {
          window.location = '/order/new';
        }, 500);
      }
    });
  };

  const userInfo = {
    firstName,
    lastName,
    email,
    addressLine1,
    addressLine2,
    postalCode,
    city: city.label,
    cityLocation,
    country: 'Ireland',
    password,
    phoneNumber
  };

  const checkValidation = () => {
    let focusField = '';
    if (!phoneNumber) {
      setPhoneNumberMsg('Mandatory Field. Please Enter your Contact Number');
      focusField = focusField === '' ? 'phoneNumber' : focusField;
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
    <>
      <Spinner isLoading={isLoading} />
      {socialProfile.isExisting === false && (
        <div className='registration'>
          <div className='d-flex justify-content-center'>
            <div className='col-12 col-md-6'>
              <h3 className='mb-3'>Complete your Profile</h3>
              <span className='font-italic fs-smaller text-grey'>
                Please fill in your details. [ * marks mandatory fields]
              </span>
              <Input
                id='firstName'
                labelData='First Name'
                labelClass='text-grey pt-2px'
                valueData={firstName}
                valueClass='pl-125px'
              />
              <Input
                id='lastName'
                labelData='Last Name'
                labelClass='text-grey pt-2px'
                valueData={lastName}
                valueClass='pl-125px'
              />
              <Input
                id='phoneNumber'
                labelData='* Phone Number'
                labelClass='text-grey pt-2px'
                valueData={phoneNumber}
                valueClass='pl-125px'
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                  setPhoneNumberMsg('');
                }}
                errMessage={phoneNumberMsg}
              />
              <Input
                id='email'
                labelData='Email'
                labelClass='text-grey pt-2px'
                valueData={email}
                valueClass='pl-125px'
              />
              <Input
                id='password'
                valueType='password'
                labelData='* Password'
                labelClass='text-grey pt-2px'
                valueData={password}
                valueClass='pl-125px'
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
                valueClass='pl-125px'
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
                valueClass='pl-125px'
                onChange={(event) => setAddressLine2(event.target.value)}
              />
              <Input
                id='postalCode'
                labelData='* Postal Code'
                labelClass='text-grey pt-2px'
                valueData={postalCode.toUpperCase()}
                valueClass='pl-125px'
                onChange={(event) => {
                  setPostalCode(event.target.value.toUpperCase());
                  setPostalCodeMsg('');
                }}
                errMessage={postalCodeMsg}
              />
              <Dropdown
                label='City'
                labelClass='text-grey pt-2px'
                options={cityList}
                selectedValue={city || cityList[0]}
                placeholderClass='pl-122px'
                onSelect={(res) => {
                  const cityInfo = res.value.split(';');
                  setCity(cityList.filter((city) => city.label === cityInfo[0])[0]);
                  setCityLocation(cityInfo[1]);
                }}
              />
              <Input
                id='country'
                isDisabled={true}
                labelData='Country'
                labelClass='text-grey pt-2px'
                valueData='Ireland'
                valueClass='pl-125px'
              />
              <div className='d-flex justify-content-end'>
                <button
                  className='col-12 col-md-4 box btn btn-primary'
                  onClick={() => {
                    if (checkValidation()) {
                      onSubmit(userInfo);
                    }
                  }}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
