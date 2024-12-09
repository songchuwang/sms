import { addRule, exportFile, getSmsItemList } from '@/services/ant-design-pro/api';
import { EditOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Input, message } from 'antd';
import moment from 'moment';

import React, { useRef, useState } from 'react';
import { history } from 'umi';

const { TextArea } = Input;

const downLoadUrl = '/api/v1/admin/business/sms/item/export';

// 跳转到指定页面并携带参数
const goToPageWithParams = (mobile) => {
  history.push(`/smsManage/sendSms?mobile=${mobile}`);
};

const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      ...fields,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [selectedRowsKeysState, setSelectedRowKeys] = useState<API.RuleListItem[]>([]);
  const [downloadFileParams, saveDownloadFileParams] = useState({});

  const handleDownLoadFile = () => {
    exportFile(downLoadUrl, downloadFileParams);
  };

  const columns: ProColumns<API.RuleListItem>[] = [
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
      title: '短信批次',
      dataIndex: 'batchNo',
    },
    {
      title: '发送号码',
      dataIndex: 'mobile',
      valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '短信内容',
      dataIndex: 'content',
      search: false,
      render: (dom) => {
        return <div style={{ maxWidth: 400, minWidth: 300 }}>{dom}</div>;
      },
    },
    {
      title: '发送状态',
      dataIndex: 'state',
      hideInForm: true,
      valueEnum: {
        PROCESSING: {
          text: '处理中',
          status: 'Processing',
        },
        DELIVRD: {
          text: '发送成功',
          status: 'Success',
        },
        ERROR: {
          text: '异常错误',
          status: 'Error',
        },
        TIMEOUT: {
          text: '超时未接收到',
          status: 'Default',
        },
      },
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          console.log('transform', value);
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        console.log('recordrecord', _, record);

        return (
          <span>
            {record.sendTime ? moment(record.sendTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </span>
        );
      },
    },
    {
      title: '回复内容',
      dataIndex: 'replyContent',
      search: false,
    },
    {
      title: '回复时间',
      dataIndex: 'replyTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            console.log('操作', _, record);
            goToPageWithParams(record.mobile);
          }}
        >
          回复
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        // headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="smsItemId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                if (!selectedRowsKeysState.length) {
                  message.warning('请先勾选行数据');
                  return;
                }
                let mobiles = selectedRowsState.map((item) => item.mobile).join(',');
                console.log('mobiles', mobiles);
                goToPageWithParams(mobiles);
              }}
            >
              <EditOutlined /> 批量回复
            </Button>,
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleDownLoadFile();
              }}
            >
              <VerticalAlignBottomOutlined /> 导出
            </Button>,
          ];
        }}
        request={(params) => {
          console.log('paramsparams', params);
          // 存储一份查询参数，用于导出文件获取
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          return getSmsItemList(params);
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowsKeysState,
          onChange: (keys, selectedRows) => {
            console.log('selectedRowsState', keys, selectedRowsState);
            setSelectedRows(selectedRows);
            setSelectedRowKeys(keys);
          },
        }}
      />
      <ModalForm
        title={'批量回复'}
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <TextArea
          showCount
          maxLength={500}
          placeholder="请输入回复内容"
          style={{ height: 100, resize: 'none', marginBottom: '20px' }}
        />
        {/* <ProFormTextArea placeholder={"请输入回复内容"} width="lg" name="desc" /> */}
      </ModalForm>
    </PageContainer>
  );
};
export default TableList;
