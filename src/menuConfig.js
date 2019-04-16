// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: '首页',
    path: '/',
    icon: 'home',
  },
  {
    name: '反馈',
    path: 'mailTo:admin@szlee.cn',
    external: true,
    icon: 'message',
  },
];

const asideMenuConfig = [
  {
    name: '首页',
    path: '/dashboard',
    icon: 'home2',
  },
  {
    name: '写邮件',
    path: '/send',
    icon: 'edit2',
  },
  {
    name: '收件箱',
    path: '/inbox',
    icon: 'mail',
  },
  {
    name: '发件箱',
    path: '/outbox',
    icon: 'forward',
  },
  {
    name: '草稿箱',
    path: '/draftbox',
    icon: 'publish',
  },
  {
    name: '垃圾箱',
    path: '/spambox',
    icon: 'topic',
  },
  {
    name: '回收站',
    path: '/recycle',
    icon: 'delete',
  },
];

export { headerMenuConfig, asideMenuConfig };
