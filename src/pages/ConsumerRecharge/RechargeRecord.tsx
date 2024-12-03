import { exportFile, getRechargeRecordList } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';

const downLoadUrl = '/api/v1/admin/business/recharge/log/export';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [downloadFileParams, saveDownloadFileParams] = useState({});

  const handleDownLoadFile = () => {
    console.log('downloadFileParams', downloadFileParams);
    exportFile(downLoadUrl, downloadFileParams);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'textarea',
      search: false,
      render: (dom, entity, index) => {
        return index + 1;
      },
    },
    {
      title: '充值金额',
      dataIndex: 'rechargeMoney',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '充值时间',
      dataIndex: 'date',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          console.log('transform', value);
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        console.log('recordrecord', _, record);

        return <span>{moment(record.date).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleDownLoadFile();
            }}
          >
            <PlusOutlined /> 导出
          </Button>,
        ]}
        request={(params) => {
          // 存储一份查询参数，用于导出文件获取
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          return getRechargeRecordList(params);
        }}
        columns={columns}
        rowSelection={false}
      />
    </PageContainer>
  );
};
export default TableList;
