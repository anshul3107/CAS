export const checkLogin = () => {
  if (
    !window.localStorage.getItem('authData') &&
    window.location.pathname !== '/user/login' &&
    window.location.pathname !== '/user/register'
  ) {
    window.location = '/user/login';
  }
};
