import Registration from './Components/Registration';
import HomePage from './Components/Homepage';

const rootPath = '/';
const homePagePath = '/home';
const registrationPath = '/user/register';

export const routes = [
    {path: homePagePath, component: HomePage},
    {path: registrationPath, component: Registration}
];

export const redirections = [{from: rootPath, to: homePagePath}];
