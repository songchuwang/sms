import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '杰讯互联短信平台',
  pwa: true,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  // logo: require('../public/icons/logo.png'),
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    sider: {
      // 折叠按钮的背景颜色（深色蓝）
      colorBgCollapsedButton: '#1b263b',
      // 折叠按钮悬停时的文本颜色（白色）
      colorTextCollapsedButtonHover: '#ffffff',
      // 折叠按钮的默认文本颜色（浅灰色，适应深色背景）
      colorTextCollapsedButton: '#b2b2b2',

      // 菜单的背景颜色（非常深的蓝色）
      colorMenuBackground: '#121a2d',

      // 菜单项的高度（可以根据设计调整）
      menuHeight: 48,

      // 折叠且提升状态的菜单项背景色（略深于普通背景）
      colorBgMenuItemCollapsedElevated: '#1e2b40',

      // 菜单项分隔线的颜色（比背景稍浅，增加层次感）
      colorMenuItemDivider: '#2e3b53',

      // 菜单项悬停时的背景颜色（比背景深一些，突出显示）
      colorBgMenuItemHover: '#27344d',

      // 激活状态下的菜单项背景颜色（亮蓝色，突出显示）
      colorBgMenuItemActive: '#1465c0',

      // 选中状态下的菜单项背景颜色（可以与激活状态相同或不同）
      colorBgMenuItemSelected: '#1465c0',

      // 选中状态下的菜单项文本颜色（白色，确保在深色背景上可读）
      colorTextMenuSelected: '#ffffff',

      // 菜单项悬停时的文本颜色（白色）
      colorTextMenuItemHover: '#ffffff',

      // 激活状态下的菜单项文本颜色（白色）
      colorTextMenuActive: '#ffffff',

      // 菜单项的默认文本颜色（浅灰色，适应深色背景）
      colorTextMenu: '#b2b2b2',

      // 次要菜单项的文本颜色（更浅的灰色，用于区分）
      colorTextMenuSecondary: '#888888',

      // 内联布局时的内边距（根据设计需求调整）
      paddingInlineLayoutMenu: 16,

      // 块级布局时的内边距（根据设计需求调整）
      paddingBlockLayoutMenu: 8,

      // 菜单顶部标题的字体颜色（白色）
      colorTextMenuTitle: '#ffffff',

      // 选中状态下的子菜单项文本颜色（白色）
      colorTextSubMenuSelected: '#ffffff',
    },
  },
};

export default Settings;
