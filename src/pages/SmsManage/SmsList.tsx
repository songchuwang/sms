import {
  addRule,
  getSmsCheckLog,
  getSmsList,
  handleSmsExamine,
  updateRule,
} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsActionType } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Drawer, message } from 'antd';
import moment from 'moment';
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

const TableList: React.FC = () => {
  const actionDesRef = useRef<ProDescriptionsActionType>();

  const drawerRef = useRef();

  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);

  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showRejectTextArea, setShowRejectTextArea] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();

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
      title: '发送方式',
      dataIndex: 'sendType',
      hideInForm: true,
      search: false,
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
      dataIndex: 'processionCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '发送中',
      dataIndex: 'failCount',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          console.log('transform', value);
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        return <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
          text: '已发送',
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
      render: (_, record) => {
        let option = [];
        if (record.status === 0) {
          option.push(
            <a
              key="config"
              onClick={() => {
                handleExamineModalOpen(true);
                setCurrentRow(record);
              }}
            >
              审核
            </a>,
          );
        } else {
          option.push(
            <a
              onClick={() => {
                setCurrentRow(record);
                setTimeout(() => {
                  setShowDetail(true);
                  if (actionDesRef.current) {
                    actionDesRef.current.reload();
                  }
                }, 200);
              }}
              key="bz"
            >
              备注
            </a>,
          );
        }
        return option;
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
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalOpen(true);
          //   }}
          // >
          //   <PlusOutlined /> 新建
          // </Button>,
        ]}
        request={getSmsList}
        columns={columns}
        rowSelection={false}
      />
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
        actionRef={drawerRef}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        <ProDescriptions
          actionRef={actionDesRef}
          title="备注"
          column={1}
          request={async () => {
            let payload = {
              smsId: currentRow.smsId,
            };
            let response = await getSmsCheckLog(payload);
            const data = response.data;
            return Promise.resolve({
              success: true,
              data,
            });
          }}
        >
          <ProDescriptions.Item dataIndex="createBy" label="审核人" />
          <ProDescriptions.Item dataIndex="createTime" label="审核时间" valueType="dateTime" />
          {currentRow?.status === 3 ? (
            <ProDescriptions.Item dataIndex="remark" label="审核未通过原因" />
          ) : null}
          {currentRow?.status === 2 ? (
            <ProDescriptions.Item dataIndex="sendTime" label="短信发送时间" valueType="dateTime" />
          ) : null}
        </ProDescriptions>
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
