import { getBusinessConsumption } from '@/services/ant-design-pro/api';

import {
  AuditOutlined,
  BookOutlined,
  CalculatorOutlined,
  CommentOutlined,
  CrownOutlined,
  FundOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Card, Radio, theme } from 'antd';
import { createStyles } from 'antd-style';
import ReactEcharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    tabs: {
      backgroundColor: 'red',
    },
    chart1_active: {
      background: 'pink',
      padding: '5px 10px',
      borderRadius: '2px',
    },
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
    contentLink: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '16px',
      a: {
        marginRight: '32px',
        display: 'inline-block',
        fontSize: '16px',
        marginLeft: '5px',
        // width:'92px',
        img: {
          width: '24px',
        },
      },
      img: { marginRight: '8px', verticalAlign: 'middle' },
      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        a: {
          marginRight: '16px',
        },
      },
      [`@media screen and (max-width: ${token.screenSM}px)`]: {
        position: 'absolute',
        bottom: '-4px',
        left: '0',
        width: '1000px',
        a: {
          marginRight: '16px',
        },
        img: {
          marginRight: '4px',
        },
      },
    },
  };
});
/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
  cardType: number;
}> = ({ title, cardType }) => {
  const { styles } = useStyles();
  const initialState = useModel('@@initialState');
  const { currentUser } = initialState?.initialState || {};

  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      {cardType === 1 ? (
        <div>
          <div>
            <img src="" alt="" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ color: '#3A4663', fontSize: 16 }}>
                {currentUser?.realName} | 企业编码：{currentUser?.businessId}
              </span>
              <span style={{ color: '#3A4663', fontSize: 16, marginTop: 5, marginBottom: 5 }}>
                {currentUser?.name}
              </span>
              <span style={{ color: '#3A4663', fontSize: 16 }}>
                广东深圳市龙岗区{currentUser?.address}
              </span>
            </div>
          </div>
          <div></div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                width: '100%',
                flex: 1,
              }}
            >
              <div className={styles.contentLink}>
                <Link to="/smsManage/smsList">
                  <a>
                    <AuditOutlined style={{ marginRight: '5px' }} />
                    待审核短信
                  </a>
                </Link>
                <Link to="/smsManage/sendSms">
                  <a>
                    <CommentOutlined style={{ marginRight: '5px' }} />
                    发送短信
                  </a>
                </Link>
                <Link to="/account/employeeAccount">
                  <a>
                    <TeamOutlined style={{ marginRight: '5px' }} />
                    员工账户
                  </a>
                </Link>
              </div>
              <div className={styles.contentLink}>
                <Link to="/consumption/accountRecharge">
                  <a>
                    <CrownOutlined style={{ marginRight: '5px' }} />
                    账户充值
                  </a>
                </Link>
                <Link to="/AddressBookManage">
                  <a>
                    <BookOutlined style={{ marginRight: '5px' }} />
                    通讯录
                  </a>
                </Link>
                <Link to="/consumption/consumptionDetails">
                  <a>
                    <CalculatorOutlined style={{ marginRight: '5px' }} />
                    消费明细
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      ></div>
    </div>
  );
};

const Welcome: React.FC = () => {
  // const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  // const [businessCountArr, setBusinessCount] = useState([]);
  const [businessConsumptionArr, setBusinessConsumption] = useState([]); // 企业消费图表
  // const [revenueArr, setRevenue] = useState([]); // 企业消费图表
  // 企业消费tab切换
  const [activeTab, setActiveTab] = useState('1');
  // 平台营收tab
  // const [activeRevenueTab, setRevenueActiveTab] = useState('2');
  // 平台短信条数tab
  // const [activeSMSTab, setSMSActiveTab] = useState('2');
  // 平台短信条数数据
  // const [smsCountArr, setSmsCount] = useState([]); // 企业消费图表

  const onTabChange = (e: RadioChangeEvent) => {
    setActiveTab(e.target.value);
  };
  // const onRevenueTabChange = (e: RadioChangeEvent) => {
  //   setRevenueActiveTab(e.target.value);
  // };
  // const onSmsTabChange = (e: RadioChangeEvent) => {
  //   setSMSActiveTab(e.target.value);
  // };

  useEffect(() => {
    // getBusinessCount().then((res) => {
    //   setBusinessCount(res.list);
    // });
    getBusinessConsumption({
      type: activeTab,
    }).then((res) => {
      setBusinessConsumption(res.list);
    });
    // getRevenueData({
    //   type: activeRevenueTab,
    // }).then((res) => {
    //   setRevenue(res.list);
    // });
    // getSmsData({
    //   type: activeSMSTab,
    // }).then((res) => {
    //   setSmsCount(res.list);
    // });
  }, []);
  // 平台企业消费折线图
  const LineChart1 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['消费(元)'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: businessConsumptionArr.map((item) => item.date),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '5%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '消费(元)',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };
    return <ReactEcharts option={option} />;
  };
  const LineChart2 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['发送短信(条)'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: businessConsumptionArr.map((item) => item.date),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '5%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '发送短信(条)',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };
    return <ReactEcharts option={option} />;
  };
  // 剩余短信
  const LineChart3 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['剩余短信(条)'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: businessConsumptionArr.map((item) => item.date),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '5%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '剩余短信(条)',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };
    return <ReactEcharts option={option} />;
  };
  // 充值
  const LineChart4 = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['充值(元)'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: businessConsumptionArr.map((item) => item.date),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '5%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '充值(元)',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };
    return <ReactEcharts option={option} />;
  };

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          {/* <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用杰讯互联短信管理平台
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            这是一段平台介绍文本：Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents
            的脚手架方案。致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
          </p> */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              cardType={1}
              href="https://umijs.org/docs/introduce/introduce"
              title="账户基本信息"
              desc="umi 是一个可扩展的企业级前端应用框架,umi 以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。"
            />
            <InfoCard
              index={2}
              cardType={2}
              title="快捷入口"
              href="https://ant.design"
              desc="antd 是基于 Ant Design 设计体系的 React UI 组件库，主要用于研发企业级中后台产品。"
            />
          </div>
        </div>
      </Card>
      <Card
        style={{
          borderRadius: 8,
          marginTop: 10,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              width: '100%',
            }}
          >
            <FundOutlined style={{ fontSize: 18 }} />
            <span style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>数据看板</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ width: '50%', height: '300px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  paddingRight: '25px',
                }}
              >
                <Radio.Group value={activeTab} onChange={onTabChange} style={{}}>
                  <Radio.Button value="1">近半年</Radio.Button>
                  <Radio.Button value="2">近一年</Radio.Button>
                </Radio.Group>
              </div>
              <LineChart1 />
            </div>
            <div style={{ width: '50%', height: '300px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                  height: '32px',
                }}
              ></div>
              <LineChart2 />
            </div>
            <div style={{ width: '50%', height: '300px', marginTop: '40px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                  height: '32px',
                }}
              ></div>
              <LineChart3 />
            </div>
            <div style={{ width: '50%', height: '300px', marginTop: '40px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  paddingRight: '25px',
                }}
              >
                <Radio.Group value={activeTab} onChange={onTabChange} style={{}}>
                  <Radio.Button value="1">近半年</Radio.Button>
                  <Radio.Button value="2">近一年</Radio.Button>
                </Radio.Group>
              </div>
              <LineChart4 />
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
