import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Col, Row, Tooltip } from 'antd';
import type { DataItem } from '../data.d';
import { ChartCard, Field } from './Charts';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: {
    marginBottom: 24,
  },
};
const IntroduceRow = ({
  loading,
  visitData,
  sendCountData,
  leftCountData,
  rechargeLogData,
}: {
  loading: boolean;
  visitData: DataItem[];
}) => {
  // const { styles } = useStyles();
  // const config = {
  //   tooltip: {
  //     formatter: (item) => {
  //       console.log('tooltip123',item);
  //       return { sendCount: item.sendCount, date: item.date + '%' };
  //     },
  //   }
  // }
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="发送短信（条）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={sendCountData
            .map((item) => item.sendCount)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
          footer={
            <Field
              label="近一周发送短信"
              value={
                sendCountData
                  .map((item) => item.sendCount)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '条'
              }
            />
          }
          contentHeight={120}
        >
          <Area
            xField="date"
            yField="sendCount"
            shapeField="smooth"
            height={120}
            axis={false}
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            colorField="showField"
            // {...config}
            padding={-20}
            data={sendCountData}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="消费（元）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={visitData
            .map((item) => item.consumption)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
          footer={
            <Field
              label="近一年消费总额"
              value={
                visitData
                  .map((item) => item.consumption)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '元'
              }
            />
          }
          contentHeight={120}
        >
          <Area
            xField="date"
            yField="consumption"
            shapeField="smooth"
            height={120}
            axis={false}
            colorField="showField"
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={visitData}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="剩余短信（条）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={leftCountData
            .map((item) => item.leftCount)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
          footer={
            <Field
              label="短信剩余量"
              value={
                leftCountData
                  .map((item) => item.leftCount)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '条'
              }
            />
          }
          contentHeight={120}
        >
          <Area
            xField="date"
            yField="leftCount"
            shapeField="smooth"
            height={120}
            axis={false}
            colorField="showField"
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={leftCountData}
          />
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title="充值（元）"
          action={
            <Tooltip title="指标说明">
              <InfoCircleOutlined />
            </Tooltip>
          }
          total={rechargeLogData
            .map((item) => item.rechargeMoney)
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}
          footer={
            <Field
              label="近一年充值总额"
              value={
                rechargeLogData
                  .map((item) => item.rechargeMoney)
                  .reduce((accumulator, currentValue) => accumulator + currentValue, 0) + '元'
              }
            />
          }
          contentHeight={120}
        >
          <Area
            xField="date"
            yField="rechargeMoney"
            shapeField="smooth"
            height={120}
            axis={false}
            colorField="showField"
            style={{
              fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
              fillOpacity: 0.6,
              width: '100%',
            }}
            padding={-20}
            data={rechargeLogData}
          />
        </ChartCard>
      </Col>
    </Row>
  );
};
export default IntroduceRow;
