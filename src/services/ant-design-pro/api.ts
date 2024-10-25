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
