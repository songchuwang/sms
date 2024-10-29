// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/admin/home/business/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  console.log('outLogin', options);
  return request<Record<string, any>>('/api/v1/admin/loginOut', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
//   return request<API.LoginResult>('/api/login/account', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export async function getEmployeeList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);

  const msg = await request<API.RuleList>('/api/v1/admin/business/user/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}

export async function getPlatformRoleList(options?: { [key: string]: any }) {
  console.log('getPlatformRoleList', options);
  const msg = await request<API.RuleList>('/api/v1/admin/business/role/list', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
  console.log('getPlatformRoleList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}

export async function handleEmployeeRemove(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/user/delete', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleEmployeeAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/user/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleEmployeeUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/user/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

// 启用账号
export async function handleAccountEnable(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/business/user/enable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
// 禁用账号
export async function handleAccountDisable(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/business/user/disable', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function getBusinessCount() {
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/business/count', {
    method: 'GET',
    params: {},
  });
}

export async function getBusinessConsumption(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/business/consumption', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
// 平台营收
export async function getRevenueData(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/revenue', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
// 平台短信条数
export async function getSmsData(
  params: {
    businessId?: string;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口', params);
  return request<API.RuleList>('/api/v1/admin/home/platform/statistics/sms/count', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 平台短信条数
export async function getBusinessInfo() {
  return request<API.RuleList>('/api/v1/admin/home/business/info', {
    method: 'GET',
  });
}

export async function getSmsList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);

  const msg = await request<API.RuleList>('/api/v1/admin/business/sms/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}

export async function getTempList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);
  const msg = await request<API.RuleList>('/api/v1/admin/business/sms/template/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}

export async function getSignatureList(options?: { [key: string]: any }) {
  console.log('getAccountList', options);
  const msg = await request<API.RuleList>('/api/v1/admin/business/sms/sign/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
  console.log('getAccountList result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}

export async function handleSignAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/sign/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleTempAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/template/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleTempUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/template/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleSignUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/sign/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleTempRemove(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/template/delete', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function handleSignRemove(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/sms/sign/delete', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function businessSubmit(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/submit', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

export async function getRoleList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('列表翻页接口222', params, options);
  let payload = {
    ...params,
    pageNum: params.current,
  };
  delete payload.current;

  // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
  // 如果需要转化参数可以在这里进行修改
  const msg = await request<API.RuleList>('/api/v1/admin/business/role/page', {
    method: 'POST',
    data: {
      method: 'post',
      ...(payload || {}),
    },
  });
  console.log('request result', msg);
  return {
    data: msg.list,
    success: msg.success,
    total: msg.total,
  };
}
export async function handleRoleRemove(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/admin/business/role/delete', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
export async function getMenuList(options?: { [key: string]: any }) {
  console.log('getRoleList', options);
  return request<API.RuleList>('/api/v1/admin/business/role/menu/list', {
    method: 'GET',
    params: {
      ...options,
    },
  });
}
export async function handleMenuAdd(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/role/add', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
export async function handleMenuUpdate(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/admin/business/role/update', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}
