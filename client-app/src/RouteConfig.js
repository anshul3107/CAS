import Registration from './Components/Registration';
import HomePage from './Components/Homepage';
import UserLogin from './Components/UserLogin';
import VerifyToken from './Components/VerifyToken';
import Profile from './Components/Profile';
import PageNotFound from './Components/PageNotFound';

const rootPath = '/';
const homePagePath = '/home';
const registrationPath = '/user/register';
const loginPath = '/user/login';
const verifyTokenPath = '/verify/token';
const profilePath = '/user/profile';

export const routes = [
    {path: homePagePath, component: HomePage},
    {path: registrationPath, component: Registration},
    {path: loginPath, component: UserLogin},
    {path: verifyTokenPath, component: VerifyToken},
    {path: profilePath, component: Profile},

    {component: PageNotFound}
];

export const redirections = [{from: rootPath, to: homePagePath}];
