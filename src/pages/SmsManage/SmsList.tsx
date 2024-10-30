import {
  addRule,
  getSmsList,
  handleSmsExamine,
  removeRule,
  updateRule,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsActionType } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

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

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};
const TableList: React.FC = () => {
  const actionDesRef = useRef<ProDescriptionsActionType>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showRejectTextArea, setShowRejectTextArea] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.RuleListItem>[] = [
    // {
    //   title: '任务编号',
    //   dataIndex: 'name',
    //   search: false,
    // },
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
      title: '发送方式',
      dataIndex: 'sendType',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '即时发送',
          // status: 'Default',
        },
        1: {
          text: '定时发送',
          // status: 'Processing',
        },
      },
    },
    {
      title: '发送时间',
      dataIndex: 'fixedTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '发送号码数',
      dataIndex: 'mobileCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '短信条数',
      dataIndex: 'smsCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '预估计费金额（元）',
      dataIndex: 'cost',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '发送成功短信（条）',
      dataIndex: 'sucCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '发送失败短信（条）',
      dataIndex: 'failCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return <Input {...rest} placeholder={'请输入异常原因！'} />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      valueType: 'textarea',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '待审核',
          status: 'Processing',
        },
        1: {
          text: '审核通过，待发送',
          status: 'Processing',
        },
        2: {
          text: '发送成功',
          status: 'Success',
        },
        3: {
          text: '审核未通过',
          status: 'Error',
        },
        4: {
          text: '发送失败',
          status: 'Error',
        },
        5: {
          text: '过期未审核',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleExamineModalOpen(true);
            setCurrentRow(record);
          }}
        >
          审核
        </a>,
        <a
          onClick={() => {
            // handleNotesModalOpen(true);
            setShowDetail(true);
            setCurrentRow(record);
          }}
          key="subscribeAlert"
        >
          备注
        </a>,
        // render: (dom, entity) => {
        //   return (
        //     <a
        //       onClick={() => {
        //         setCurrentRow(entity);
        //         setShowDetail(true);
        //       }}
        //     >
        //       {dom}
        //     </a>
        //   );
        // },
      ],
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getSmsList}
        columns={columns}
        rowSelection={false}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
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
      <ModalForm
        title={'短信审核'}
        width="400px"
        open={examineModalOpen}
        onOpenChange={handleExamineModalOpen}
        onValuesChange={(changeValues) => {
          console.log(changeValues);
          if (changeValues?.status === '3') {
            setShowRejectTextArea(true);
          } else if (changeValues?.status === '2') {
            setShowRejectTextArea(false);
          }
        }}
        onFinish={async (value) => {
          console.log('handleSmsExamine', value);
          let payload = {
            ...value,
            smsId: currentRow.smsId,
          };
          const result = await handleSmsExamine(payload as API.RuleListItem);
          if (result.code === '200') {
            message.success('审核成功');
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(result.msg);
          }
          handleExamineModalOpen(false);
        }}
      >
        <ProFormRadio.Group
          name="status"
          label={''}
          options={[
            {
              value: '2',
              label: '通过，允许发送短信',
            },
            {
              value: '3',
              label: '驳回，不允许发送短信',
            },
          ]}
        />
        {showRejectTextArea ? (
          <ProFormTextArea
            width="md"
            name="remark"
            placeholder="请输入驳回原因"
            rules={[
              {
                required: true,
                message: '请输入驳回原因',
              },
            ]}
          />
        ) : null}
      </ModalForm>
      <ModalForm
        title={'备注'}
        width="400px"
        open={notesModalOpen}
        onOpenChange={handleNotesModalOpen}
        // onFinish={async (value) => {
        //   const success = await handleAdd(value as API.RuleListItem);
        //   if (success) {
        //     handleExamineModalOpen(false);
        //     if (actionRef.current) {
        //       actionRef.current.reload();
        //     }
        //   }
        // }}
      >
        <ProFormRadio.Group
          name="type"
          label={''}
          options={[
            {
              value: '0',
              label: '通过，允许发送短信',
            },
            {
              value: '1',
              label: '驳回，不允许发送短信',
            },
          ]}
        />
        {/* <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        /> */}
        <ProFormTextArea
          width="md"
          name="desc"
          placeholder="请输入驳回原因"
          rules={[
            {
              required: true,
              message: '请输入驳回原因',
            },
          ]}
        />
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
        <ProDescriptions
          actionRef={actionDesRef}
          title="高级定义列表 request"
          column={1}
          request={async () => {
            return Promise.resolve({
              success: true,
              data: {
                id: '这是一段文本2',
                date: '20200730',
                money: '12121',
                reason: '原因',
                reason2: '原因2',
              },
            });
          }}
          // extra={<Button type="link">修改</Button>}
        >
          <ProDescriptions.Item dataIndex="id" label="审核人" />
          <ProDescriptions.Item dataIndex="date" label="日期" valueType="date" />
          <ProDescriptions.Item dataIndex="reason" label="审核未通过原因" />
          <ProDescriptions.Item dataIndex="date" label="短信发送时间" />
          <ProDescriptions.Item dataIndex="reason2" label="发送失败原因" />
          <ProDescriptions.Item label="money" dataIndex="money" valueType="money" />
          {/* <ProDescriptions.Item label="文本" valueType="option">
            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.reload();
              }}
              key="reload"
            >
              刷新
            </Button>
            <Button key="rest">重置</Button>
          </ProDescriptions.Item> */}
        </ProDescriptions>
        {/* {currentRow?.name && (
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
        )} */}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
