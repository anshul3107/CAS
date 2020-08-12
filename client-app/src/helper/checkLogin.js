export const checkLogin = () => {
  if (
    !window.localStorage.getItem('authData') &&
    window.location.pathname !== '/user/login' &&
    window.location.pathname !== '/user/register' &&
    window.location.pathname !== '/verify/token' &&
    window.location.pathname !== '/forgot/password' &&
    window.location.pathname !== '/account/password' &&
    window.location.pathname !== '/user/socialprofile'
  ) {
    window.location = '/user/login';
  }
};
