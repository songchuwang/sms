import {
  getConsumptionLog,
  getLeftCount,
  getRechargeLog,
  getSendCount,
} from '@/services/ant-design-pro/api';

import {
  AuditOutlined,
  BookOutlined,
  CalculatorOutlined,
  CommentOutlined,
  CrownOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Avatar, Card, Col, Row } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import IntroduceRow from './components/IntroduceRow';
dayjs.extend(relativeTime);

const useStyles = createStyles(({ token }) => {
  return {
    tabs: {
      backgroundColor: 'red',
    },
    extraContent: {
      zoom: '1',
      '&::before, &::after': { display: 'table', content: "' '" },
      '&::after': {
        clear: 'both',
        height: '0',
        fontSize: '0',
        visibility: 'hidden',
      },
      float: 'right',
      whiteSpace: 'nowrap',
      [`@media screen and (max-width: ${token.screenXL}px) and (min-width: @screen-lg)`]: {
        marginLeft: '-44px',
      },
      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        float: 'none',
        marginRight: '0',
      },
      [`@media screen and (max-width: ${token.screenMD}px)`]: {
        marginLeft: '-16px',
      },
    },
    projectList: {
      '.ant-card-meta-description': {
        height: '44px',
        overflow: 'hidden',
        color: token.colorTextSecondary,
        lineHeight: '22px',
      },
    },
    cardTitle: {
      fontSize: '0',
      a: {
        display: 'inline-block',
        height: '24px',
        marginLeft: '12px',
        color: token.colorTextHeading,
        fontSize: token.fontSize,
        lineHeight: '24px',
        verticalAlign: 'top',
        '&:hover': {
          color: token.colorPrimary,
        },
      },
    },
    projectGrid: {
      width: '33.33%',
      [`@media screen and (max-width: ${token.screenMD}px)`]: { width: '50%' },
      [`@media screen and (max-width: ${token.screenXS}px)`]: { width: '100%' },
    },
    projectItemContent: {
      display: 'flex',
      height: '20px',
      marginTop: '8px',
      overflow: 'hidden',
      fontSize: '12px',
      gap: 'epx',
      lineHeight: '20px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      wordBreak: 'break-all',
      a: {
        display: 'inline-block',
        flex: '1 1 0',
        color: token.colorTextSecondary,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'break-all',
        '&:hover': {
          color: token.colorPrimary,
        },
      },
    },
    datetime: {
      flex: '0 0 auto',
      float: 'right',
      color: token.colorTextDisabled,
    },
    activitiesList: {
      padding: '0 24px 8px 24px',
    },
    activeCard: {
      [`@media screen and (max-width: ${token.screenXL}px) and (min-width: @screen-lg)`]: {
        marginBottom: '24px',
      },
      [`@media screen and (max-width: ${token.screenLG}px)`]: {
        marginBottom: '24px',
      },
    },
    chart1_active: {
      background: 'pink',
      padding: '5px 10px',
      borderRadius: '2px',
    },
    pageHeaderContent: {
      display: 'flex',
      [`@media screen and (max-width: ${token.screenSM}px)`]: {
        display: 'block',
      },
    },
    avatar: {
      flex: '0 1 72px',
      '& > span': {
        display: 'block',
        width: '72px',
        height: '72px',
        borderRadius: '72px',
      },
    },
    content: {
      position: 'relative',
      top: '4px',
      flex: '1 1 auto',
      marginLeft: '24px',
      color: token.colorTextSecondary,
      lineHeight: '22px',
      [`@media screen and (max-width: ${token.screenSM}px)`]: {
        marginLeft: '0',
      },
    },
    contentTitle: {
      marginBottom: '12px',
      color: token.colorTextHeading,
      fontWeight: '500',
      fontSize: '20px',
      lineHeight: '28px',
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

// const ExtraContent: FC<Record<string, any>> = () => {
//   const { styles } = useStyles();
//   return (
//     <div className={styles.extraContent}>
//       <img style={{ width: 100, height: 100 }} src="http://47.119.114.79:8080/profile/upload/2024/10/28/WechatIMG790_20241028110045A009.png" alt="" />
//     </div>
//   );
// };

const PageHeaderContent: FC<{
  currentUser: Partial<CurrentUser>;
}> = ({ currentUser }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          {/* 早安， */}
          {currentUser.account}
          {/* ，祝你开心每一天！ */}
        </div>
        <div>
          {currentUser.name} | {currentUser.address}
        </div>
      </div>
    </div>
  );
};

const Welcome: React.FC = () => {
  // const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  console.log('initialState123', initialState);

  const { currentUser } = initialState || {};

  console.log('currentUser123', currentUser);

  // 近期消费记录
  const [consumptionData, setConsumptionData] = useState([]); // 企业消费图表

  const [sendCountData, setSendCountData] = useState([]); // 发送短信量图表

  const [leftCountData, setLeftCountData] = useState([]); // 短信剩余量图表

  const [rechargeLogData, setRechargeLogData] = useState([]); // 充值记录图表
  // 消费记录
  const getConsumptionLogFn = (type = 2) => {
    let params = {
      type: type,
    };
    getConsumptionLog(params).then((res) => {
      console.log('getConsumptionLog', res);
      setConsumptionData(
        res.list.map((item) => {
          return {
            ...item,
            showField: '消费金额',
          };
        }) || [],
      );
    });
  };
  // 发送短信（条）
  const getSendCountFn = () => {
    getSendCount().then((res) => {
      console.log('getSendCountFn', res);
      setSendCountData(
        res.list.map((item) => {
          return {
            ...item,
            showField: '发送条数',
          };
        }) || [],
      );
    });
  };
  // 剩余短信
  const getLeftCountFn = () => {
    getLeftCount().then((res) => {
      setLeftCountData(
        res.list.map((item) => {
          return {
            ...item,
            showField: '剩余短信条数',
          };
        }) || [],
      );
    });
  };
  const getRechargeLogFn = (type = 2) => {
    let params = {
      type: type,
    };
    getRechargeLog(params).then((res) => {
      setRechargeLogData(
        res.list.map((item) => {
          return {
            ...item,
            showField: '充值金额',
          };
        }) || [],
      );
    });
  };
  useEffect(() => {
    // 图表——近期消费记录
    getConsumptionLogFn();
    // 发送短信数据
    getSendCountFn();
    // 剩余短信量
    getLeftCountFn();
    // 充值记录
    getRechargeLogFn();
  }, []);

  const { styles } = useStyles();

  let data = [
    {
      id: 'xxx1',
      title: '待审核短信',
      logo: <AuditOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '查看并审核所有待发送的短信内容，确保信息准确无误',
      updatedAt: '',
      member: '',
      href: '/smsManage/smsList',
      memberLink: '',
    },
    {
      id: 'xxx2',
      title: '发送短信',
      logo: <CommentOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '直接进入短信发送页面，快速群发或单发营销、通知等短信',
      updatedAt: '',
      member: '',
      href: '/smsManage/sendSms',
      memberLink: '',
    },
    {
      id: 'xxx3',
      title: '员工账户',
      logo: <TeamOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '管理员工账户信息，包括账户创建、权限分配及密码重置等',
      updatedAt: '',
      member: '',
      href: '/account/employeeAccount',
      memberLink: '',
    },
    {
      id: 'xxx4',
      title: '账户充值',
      logo: <CrownOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '为短信账户充值，确保余额充足以支持短信发送服务',
      updatedAt: '',
      member: '',
      href: '/consumption/accountRecharge',
      memberLink: '',
    },
    {
      id: 'xxx5',
      title: '通讯录',
      logo: <BookOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '维护联系人信息，方便快速选择短信接收者，提高发送效率',
      updatedAt: '',
      member: '',
      href: '/AddressBookManage',
      memberLink: '',
    },
    {
      id: 'xxx6',
      title: '消费明细',
      logo: <CalculatorOutlined style={{ width: 20, height: 20, fontSize: 18 }} />,
      description: '查看短信发送的消费记录，包括发送时间、数量及费用详情，便于财务管理',
      updatedAt: '',
      member: '',
      href: '/consumption/consumptionDetails',
      memberLink: '',
    },
  ];

  return (
    <PageContainer
      content={
        <PageHeaderContent
          currentUser={{
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
            account: currentUser?.account,
            name: currentUser?.name,
            userid: '00000001',
            email: 'antdesign@alipay.com',
            signature: '海纳百川，有容乃大',
            title: '交互专家',
            address: `${
              currentUser?.province === currentUser?.city
                ? currentUser?.province
                : currentUser?.province + currentUser?.city
            }${currentUser?.area}${currentUser?.address}`,
          }}
        />
      }
      // extraContent={<ExtraContent />}
    >
      <Row gutter={24}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Card
            className={styles.projectList}
            style={{
              marginBottom: 24,
            }}
            title="快捷入口"
            bordered={false}
            loading={false}
            bodyStyle={{
              padding: 0,
            }}
          >
            {data.map((item) => (
              <Card.Grid className={styles.projectGrid} key={item.id}>
                <Card
                  bodyStyle={{
                    padding: 0,
                  }}
                  bordered={false}
                >
                  <Card.Meta
                    title={
                      <div className={styles.cardTitle}>
                        {item.logo ? item.logo : null}
                        <Link to={item.href || '/'}>{item.title}</Link>
                      </div>
                    }
                    description={item.description}
                  />
                  <div className={styles.projectItemContent}>
                    <Link to={item.memberLink || '/'}>{item.member || ''}</Link>
                    {item.updatedAt && (
                      <span className={styles.datetime} title={item.updatedAt}>
                        {dayjs(item.updatedAt).fromNow()}
                      </span>
                    )}
                  </div>
                </Card>
              </Card.Grid>
            ))}
          </Card>
        </Col>
      </Row>
      <IntroduceRow
        visitData={consumptionData || []}
        sendCountData={sendCountData || []}
        leftCountData={leftCountData || []}
        rechargeLogData={rechargeLogData || []}
      />
    </PageContainer>
  );
};

export default Welcome;
