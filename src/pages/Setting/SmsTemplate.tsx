import {
  getTempList,
  handleTempAdd,
  handleTempRemove,
  handleTempUpdate,
  removeRule,
  updateRule,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Col, Drawer, message, Popconfirm, Row, Space } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
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
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const TableList: React.FC = () => {
  const modalFormRef = useRef<ProFormInstance>();
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
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [modalTitle, setModalTitle] = useState('新增模板');
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '模板编号',
      dataIndex: 'templateId',
      search: false,
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      ellipsis: true,
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          console.log('transform', value);
          return { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime() };
        },
      },
      render: (_, record) => {
        console.log('recordrecord', _, record);

        return <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '备注说明',
      dataIndex: 'remark',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '创建人',
      dataIndex: 'updateBy',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleModalOpen(true);
            setModalTitle('编辑模板');
            setTimeout(() => {
              if (modalFormRef.current) {
                modalFormRef.current.setFieldsValue(record);
                setCurrentRow(record);
              }
            });
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="tempRemove"
          style={{ display: 'none' }}
          title="确定要删除该签名模板吗？"
          onConfirm={async () => {
            await handleTempRemove({
              templateId: record.templateId,
            });
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
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
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              if (modalFormRef.current) {
                setModalTitle('新增模板');
                modalFormRef.current.resetFields();
              }
            }}
          >
            <PlusOutlined /> 新增模板
          </Button>,
        ]}
        request={getTempList}
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
        {...formItemLayout}
        title={modalTitle}
        width="600px"
        open={createModalOpen}
        formRef={modalFormRef}
        onOpenChange={handleModalOpen}
        layout={'horizontal'}
        submitter={{
          render: (props, doms) => {
            return (
              <Row>
                <Col span={14} offset={2}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            );
          },
        }}
        onFinish={async (value) => {
          console.log('handleAccountEdit', value);
          let payload = {
            ...value,
          };
          delete payload.method;
          let result = {};
          if (modalTitle === '编辑模板') {
            result = await handleTempUpdate({
              ...payload,
              templateId: currentRow.templateId,
            });
          } else {
            result = await handleTempAdd(payload as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑模板' ? '修改成功' : '创建成功');
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(result.msg);
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
          label="模板名称"
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          label="模板内容"
          width="md"
          name="content"
        />
        <ProFormTextArea label="备注说明" width="md" name="remark" />
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
