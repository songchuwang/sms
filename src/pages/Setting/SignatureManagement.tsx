import {
  getSignatureList,
  handleSignAdd,
  handleSignRemove,
  handleSignUpdate,
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
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { useModel } from '@umijs/max';
import { Button, Col, Drawer, Input, message, Popconfirm, Row, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
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

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const TableList: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [auth, setAuth] = useState([]);
  useEffect(() => {
    setAuth(currentUser?.perms || []);
  }, []);
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
  const [modalTitle, setModalTitle] = useState('新增签名模板');

  // useEffect(() => {
  //   getPlatformRoleList().then(res => {
  //     let valueEnum = {}
  //     res.data.map(item => {
  //       valueEnum[item.roleId] = item.roleName
  //     })
  //     setRoles(valueEnum)
  //   })
  // }, [])

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '模板编号',
      dataIndex: 'signId',
      search: false,
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '模板内容',
      dataIndex: 'signName',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
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
          hidden={auth.includes('business:sms:sign:update') ? false : true}
          onClick={() => {
            handleModalOpen(true);
            setModalTitle('编辑签名模板');
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
          key="signRemove"
          style={{ display: 'none' }}
          title="确定要删除该签名模板吗？"
          onConfirm={async () => {
            await handleSignRemove({
              signId: record.signId,
            });
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          <a hidden={auth.includes('business:sms:sign:delete') ? false : true}>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        // headerTitle={'查询表格'}
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
            hidden={auth.includes('business:sms:sign:add') ? false : true}
            onClick={() => {
              handleModalOpen(true);
              if (modalFormRef.current) {
                setModalTitle('新增签名模板');
                modalFormRef.current.resetFields();
              }
            }}
          >
            <PlusOutlined /> 新增签名模板
          </Button>,
        ]}
        request={async (params) => {
          if (!auth.includes('business:sms:sign:page')) {
            return [];
          }
          return getSignatureList(params);
        }}
        columns={columns}
        rowSelection={false}
      />
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
          let payload = {
            ...value,
          };
          delete payload.method;
          let result = {};
          if (modalTitle === '编辑签名模板') {
            result = await handleSignUpdate({
              ...payload,
              signId: currentRow.signId,
            });
          } else {
            result = await handleSignAdd(payload as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑签名模板' ? '修改成功' : '创建成功');
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            // message.error(result.msg);
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入模板名称',
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
              message: '请输入模板内容',
            },
          ]}
          label="模板内容"
          width="md"
          name="signName"
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
