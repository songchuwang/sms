export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '短信管理',
    icon: 'mail',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/smsList', name: '短信列表', component: './SmsManage/SmsList' },
      { path: '/admin/upAndDowm', name: '上下行', component: './SmsManage/UpAndDowm' },
      // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
    ],
  },
  {
    name: '通讯录管理',
    icon: 'book',
    path: '/AddressBookManage',
    component: './AddressBookManage',
  },
  {
    path: '/admin',
    name: '消费充值',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/consumptionDetails',
        name: '消费明细',
        component: './ConsumerRecharge/ConsumptionDetails',
      },
      {
        path: '/admin/accountRecharge',
        name: '账户充值',
        component: './ConsumerRecharge/AccountRecharge',
      },
    ],
  },
  {
    path: '/admin',
    name: '报表统计',
    icon: 'table',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/rechargeStatistics',
        name: '充值统计',
        component: './ReportStatistics/RechargeStatistics',
      },
      {
        path: '/admin/SRVStatistics',
        name: '收发量统计',
        component: './ReportStatistics/SRVStatistics',
      },
    ],
  },
  {
    path: '/admin',
    name: '账户管理',
    icon: 'appstore',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/employeeAccount',
        name: '充值统计',
        component: './AccountManage/EmployeeAccount',
      },
      { path: '/admin/roles', name: '收发量统计', component: './AccountManage/RolesManage' },
    ],
  },
  {
    path: '/admin',
    name: '系统设置',
    icon: 'setting',
    access: 'canAdmin',
    routes: [
      { path: '/admin/smsTemplate', name: '短信模板', component: './Setting/SmsTemplate' },
      {
        path: '/admin/enterpriseCertification',
        name: '企业认证',
        component: './Setting/EnterpriseCertification',
      },
      {
        path: '/admin/signatureManagement',
        name: '签名管理',
        component: './Setting/SignatureManagement',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
