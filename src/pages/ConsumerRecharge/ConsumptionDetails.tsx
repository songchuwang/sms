import { exportFile, getConsumptionList, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const downLoadUrl = '/api/v1/admin/business/consumption/export';

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [downloadFileParams, saveDownloadFileParams] = useState({});

  const handleDownLoadFile = () => {
    exportFile(downLoadUrl, downloadFileParams);
  };
  const columns = [
    {
      title: '短信批次',
      dataIndex: 'index',
      valueType: 'textarea',
      search: false,
      render: (dom, entity, index) => {
        return index + 1;
      },
    },
    {
      title: '收信人姓名',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      valueType: 'textarea',
    },
    {
      title: '短信内容',
      dataIndex: 'content',
      valueType: 'textarea',
      search: false,
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
        return <span>{moment(record.sendTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '发送人',
      dataIndex: 'createBy',
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
          console.log('paramsparams', params);
          // 存储一份查询参数，用于导出文件获取
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          return getConsumptionList(params);
        }}
        columns={columns}
        rowSelection={false}
      />
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
