import Registration from './Components/Registration';
import HomePage from './Components/Homepage';
import UserLogin from './Components/UserLogin';

const rootPath = '/';
const homePagePath = '/home';
const registrationPath = '/user/register';
const loginPath = '/user/login';

export const routes = [
    {path: homePagePath, component: HomePage},
    {path: registrationPath, component: Registration},
    {path: loginPath, component: UserLogin}
];

export const redirections = [{from: rootPath, to: homePagePath}];
