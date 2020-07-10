import Registration from './Components/Registration';
import HomePage from './Components/Homepage';
import UserLogin from './Components/UserLogin';
import VerifyToken from './Components/VerifyToken';

const rootPath = '/';
const homePagePath = '/home';
const registrationPath = '/user/register';
const loginPath = '/user/login';
const verifyTokenPath = '/verify/token';

export const routes = [
    {path: homePagePath, component: HomePage},
    {path: registrationPath, component: Registration},
    {path: loginPath, component: UserLogin},
    {path: verifyTokenPath, component: VerifyToken}
];

export const redirections = [{from: rootPath, to: homePagePath}];
