import { outLogin } from '@/services/ant-design-pro/api';
import { LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.account || currentUser?.name}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    logout_box: {
      backgroundColor: '#2c3859',
      '&:hover': {
        backgroundColor: '#253056',
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async (currentUser) => {
    await outLogin({
      token: currentUser?.token,
    });
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const { styles } = useStyles();

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      // if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut(initialState.currentUser);
      localStorage.setItem('token', '');
      return;
      // }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  // const menuItems = [
  //   ...(menu
  //     ? [
  //         {
  //           key: 'center',
  //           icon: <UserOutlined />,
  //           label: '个人中心',
  //         },
  //         {
  //           key: 'settings',
  //           icon: <SettingOutlined />,
  //           label: '个人设置',
  //         },
  //         {
  //           type: 'divider' as const,
  //         },
  //       ]
  //     : []),
  //   {
  //     key: 'logout',
  //     icon: <LogoutOutlined />,
  //     label: '退出登录',
  //   },
  // ];

  return (
    <div
      className={styles.logout_box}
      onClick={(e) => onMenuClick(e)}
      style={{
        width: 110,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderRadius: 8,
      }}
    >
      <LogoutOutlined style={{ color: '#ccc' }} />
      <span style={{ marginLeft: 10, color: '#ccc' }}>退出登录</span>
    </div>
    // <HeaderDropdown
    //   menu={{
    //     selectedKeys: [],
    //     onClick: onMenuClick,
    //     items: menuItems,
    //   }}
    // >
    //   {children}
    // </HeaderDropdown>
  );
};
