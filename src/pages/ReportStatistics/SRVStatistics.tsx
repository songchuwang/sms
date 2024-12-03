import {
  addRule,
  exportFile,
  getSendorreceiveList,
  updateRule,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import type { TabsProps } from 'antd';
import { Button, Drawer, message, Tabs } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const downLoadUrl = '/api/v1/admin/business/report/sendorreceive/export';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
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
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [statisticsType, setType] = useState(1);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();

  const handleDownLoadFile = () => {
    let payload = {
      type: statisticsType,
    };
    exportFile(downLoadUrl, { ...payload });
  };

  const [columns, setColumns] = useState([
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
      title: '日期（天）',
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

        return <span>{moment(record.date).format('YYYY-MM-DD')}</span>;
      },
    },
    {
      title: '发送短信量（条）',
      dataIndex: 'sendCount',
      search: false,
    },
    {
      title: '收到短信量（条）',
      dataIndex: 'receiveCount',
      search: false,
    },
  ]);

  const ProTableFn = (key) => {
    if (key === '1') {
      console.log('columnscolumnscolumns1', columns);
      setColumns([
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
          title: '日期（天）',
          dataIndex: 'date',
          valueType: 'dateRange',
          search: {
            transform: (value) => {
              console.log('transform', value);
              return {
                startTime: new Date(value[0]).getTime(),
                endTime: new Date(value[1]).getTime(),
              };
            },
          },
          render: (_, record) => {
            console.log('recordrecord', _, record);

            return <span>{moment(record.date).format('YYYY-MM-DD')}</span>;
          },
        },
        {
          title: '发送短信量（条）',
          dataIndex: 'sendCount',
          search: false,
        },
        {
          title: '收到短信量（条）',
          dataIndex: 'receiveCount',
          search: false,
        },
      ]);
    } else if (key === '2') {
      console.log('columnscolumnscolumns2', columns);
      setColumns([
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
          title: '日期（月份）',
          dataIndex: 'date',
          valueType: 'dateRange',
          search: {
            transform: (value) => {
              console.log('transform', value);
              return {
                startTime: new Date(value[0]).getTime(),
                endTime: new Date(value[1]).getTime(),
              };
            },
          },
          render: (_, record) => {
            console.log('recordrecord', _, record);

            return <span>{moment(record.date).format('YYYY-MM')}</span>;
          },
        },
        {
          title: '发送短信量（条）',
          dataIndex: 'sendCount',
          search: false,
        },
        {
          title: '收到短信量（条）',
          dataIndex: 'receiveCount',
          search: false,
        },
      ]);
    } else if (key === '3') {
      console.log('columnscolumnscolumns3', columns);
      setColumns([
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
          title: '日期（年份）',
          dataIndex: 'date',
          valueType: 'dateRange',
          search: {
            transform: (value) => {
              console.log('transform', value);
              return {
                startTime: new Date(value[0]).getTime(),
                endTime: new Date(value[1]).getTime(),
              };
            },
          },
          render: (_, record) => {
            return <span>{moment(record.date).format('YYYY')}</span>;
          },
        },
        {
          title: '发送短信量（条）',
          dataIndex: 'sendCount',
          search: false,
        },
        {
          title: '收到短信量（条）',
          dataIndex: 'receiveCount',
          search: false,
        },
      ]);
    }
    console.log('columnscolumnscolumns', columns);

    return (
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
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
          let payload = {
            ...params,
            pageSize: 10,
            type: statisticsType,
          };
          // let downloadFileParams = JSON.parse(JSON.stringify(params))
          // delete downloadFileParams.current
          // delete downloadFileParams.pageSize
          // saveDownloadFileParams(downloadFileParams)
          return getSendorreceiveList(payload);
        }}
        options={false}
        columns={columns}
        rowSelection={false}
      />
    );
  };

  const onTabChange = (key: string) => {
    console.log(key);
    ProTableFn(key);
    setType(key);
    setTimeout(() => {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '日报',
      children: '',
    },
    {
      key: '2',
      label: '月报',
      children: '',
    },
    {
      key: '3',
      label: '年报',
      children: '',
    },
  ];

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" items={items} onChange={onTabChange} />
      <ProTableFn />
      <ModalForm
        title={'新建规则'}
        width="400px"
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
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
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
