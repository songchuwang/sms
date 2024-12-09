import { getBusinessInfo } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Descriptions, Divider } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
const Basic: FC = () => {
  // const initialState = useModel('@@initialState');
  // const { currentUser } = initialState?.initialState || {};

  const [businessInfo, setBusinessInfo] = useState({});

  useEffect(() => {
    getBusinessInfo().then((res) => {
      const result = res.data;
      setBusinessInfo(result);
    });
  }, []);

  return (
    <PageContainer>
      <Card bordered={false}>
        <h3>
          企业账户：账户余额<span style={{ color: '#1890ff' }}>{businessInfo?.balance}</span>
          元，短信剩余量：
          <span style={{ color: '#1890ff' }}>{businessInfo?.leftCount}</span> 条。
        </h3>
        <Descriptions
          title="第一步：请选择微信或支付宝扫码付款"
          style={{
            marginBottom: 32,
          }}
        >
          <div>待填充</div>
        </Descriptions>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />
        <Descriptions
          title="第二步：转账成功后联系平台官方客服"
          style={{
            marginBottom: 32,
          }}
        >
          <div>待填充</div>
          {/* <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
          <Descriptions.Item label="联系电话">18100000000</Descriptions.Item>
          <Descriptions.Item label="常用快递">菜鸟仓储</Descriptions.Item>
          <Descriptions.Item label="取货地址">浙江省杭州市西湖区万塘路18号</Descriptions.Item>
          <Descriptions.Item label="备注">无</Descriptions.Item> */}
        </Descriptions>
      </Card>
    </PageContainer>
  );
};
export default Basic;
