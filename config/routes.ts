export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '工作台', icon: 'home', component: './Welcome' },
  {
    path: '/smsManage',
    name: '短信管理',
    icon: 'mail',
    access: 'business:sms:manager',
    routes: [
      { path: '/smsManage', redirect: '/smsManage/sub-page' },
      {
        path: '/smsManage/smsList',
        access: 'business:sms:page',
        name: '短信列表',
        component: './SmsManage/SmsList',
      },
      {
        path: '/smsManage/upAndDowm',
        access: 'business:sms:item:page',
        name: '上下行',
        component: './SmsManage/UpAndDowm',
      },
      {
        path: '/smsManage/sendSms',
        access: 'business:sms:add',
        name: '发送短信',
        component: './SmsManage/SendSms',
      },
    ],
  },
  {
    name: '通讯录管理',
    icon: 'book',
    path: '/AddressBookManage',
    access: 'business:address:book:manager',
    component: './AddressBookManage',
  },
  {
    path: '/consumption',
    name: '消费充值',
    icon: 'crown',
    access: 'business:consumption:manager',
    routes: [
      { path: '/consumption', redirect: '/consumption/consumptionDetails' },
      {
        path: '/consumption/consumptionDetails',
        name: '消费明细',
        access: 'business:consumption:page',
        component: './ConsumerRecharge/ConsumptionDetails',
      },
      {
        path: '/consumption/accountRecharge',
        name: '账户充值',
        component: './ConsumerRecharge/AccountRecharge',
      },
      {
        path: '/consumption/rechargeRecord',
        name: '充值记录',
        access: 'business:recharge:log:page',
        component: './ConsumerRecharge/RechargeRecord',
      },
    ],
  },
  {
    path: '/statistics',
    name: '报表统计',
    icon: 'table',
    access: 'business:report:manager',
    routes: [
      { path: '/statistics', redirect: '/statistics/rechargeStatistics' },
      {
        path: '/statistics/rechargeStatistics',
        name: '充值统计',
        access: 'business:report:recharge:page',
        component: './ReportStatistics/RechargeStatistics',
      },
      {
        path: '/statistics/SRVStatistics',
        access: 'business:report:sendorreceive:page',
        name: '收发量统计',
        component: './ReportStatistics/SRVStatistics',
      },
    ],
  },
  {
    path: '/account',
    name: '账户管理',
    icon: 'appstore',
    access: 'business:user:manager',
    routes: [
      { path: '/account', redirect: '/account/employeeAccount' },
      {
        path: '/account/employeeAccount',
        name: '员工账户',
        access: 'business:user:page',
        component: './AccountManage/EmployeeAccount',
      },
      {
        path: '/account/roles',
        access: 'business:role:page',
        name: '角色管理',
        component: './AccountManage/RolesManage',
      },
    ],
  },
  {
    path: '/setting',
    name: '系统设置',
    icon: 'setting',
    access: 'business:sys:seting',
    routes: [
      { path: '/setting', redirect: '/setting/smsTemplate' },
      {
        path: '/setting/smsTemplate',
        access: 'business:sms:template:manager',
        name: '短信模板',
        component: './Setting/SmsTemplate',
      },
      {
        path: '/setting/enterpriseCertification',
        name: '企业认证',
        component: './Setting/EnterpriseCertification',
      },
      {
        path: '/setting/signatureManagement',
        access: 'business:sms:sign:manager',
        name: '签名管理',
        component: './Setting/SignatureManagement',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
