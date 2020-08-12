import Registration from './Components/Registration';
import UserLogin from './Components/UserLogin';
import VerifyToken from './Components/VerifyToken';
import Profile from './Components/Profile';
import PageNotFound from './Components/PageNotFound';
import ManagePassword from './Components/ManagePassword';
import ForgotPassword from './Components/ForgotPassword';
import NewOrder from './Components/NewOrder';
import OrderList from './Components/OrderList';
import OrderDetails from './Components/OrderDetails';
import SocialProfile from './Components/SocialProfile';

const rootPath = '/';
const registrationPath = '/user/register';
const loginPath = '/user/login';
const verifyTokenPath = '/verify/token';
const profilePath = '/user/profile';
const managePasswordPath = '/account/password';
const forgotPasswordPath = '/forgot/password';
const newOrderPath = '/order/new';
const orderListPath = '/order/list';
const orderDetailsPath = '/order/details/:orderId';
const socialProfilePath = '/user/socialprofile';

export const routes = [
  {path: registrationPath, component: Registration},
  {path: loginPath, component: UserLogin},
  {path: verifyTokenPath, component: VerifyToken},
  {path: profilePath, component: Profile},
  {path: managePasswordPath, component: ManagePassword},
  {path: forgotPasswordPath, component: ForgotPassword},
  {path: newOrderPath, component: NewOrder},
  {path: orderListPath, component: OrderList},
  {path: orderDetailsPath, component: OrderDetails},
  {path: socialProfilePath, component: SocialProfile},

  {component: PageNotFound}
];

export const redirections = [{from: rootPath, to: loginPath}];
