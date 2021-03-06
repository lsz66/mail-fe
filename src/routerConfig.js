// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Setting from './pages/Setting';
import Dashboard from './pages/Dashboard';

import SendMail from './pages/SendMail';
import EditMail from './pages/EditMail';
import ReplyMail from './pages/ReplyMail';
import ReSend from './pages/ReSend';
import Success from './pages/Success';

import Inbox from './pages/Inbox';
import Outbox from './pages/Outbox';
import DraftBox from './pages/Draftbox';
import SpamBox from './pages/Spambox';
import Recycle from './pages/Recycle';
import Read from './pages/Read';

const routerConfig = [
  {
    path: '/user/login',
    component: UserLogin,
  },
  {
    path: '/outbox',
    component: Outbox,
  },
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/send',
    component: SendMail,
  },
  {
    path: '/setting',
    component: Setting,
  },
  {
    path: '/user/register',
    component: UserRegister,
  },
  {
    path: '/inbox',
    component: Inbox,
  },
  {
    path: '/draftbox',
    component: DraftBox,
  },
  {
    path: '/spambox',
    component: SpamBox,
  },
  {
    path: '/recycle',
    component: Recycle,
  },
  {
    path: '/read',
    component: Read,
  },
  {
    path: '/success',
    component: Success,
  },
  {
    path: '/edit',
    component: EditMail,
  },
  {
    path: '/reply',
    component: ReplyMail,
  },
  {
    path: '/resend',
    component: ReSend,
  },
];

export default routerConfig;
