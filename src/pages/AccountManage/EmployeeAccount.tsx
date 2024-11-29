import {
  getEmployeeList,
  getPlatformRoleList,
  handleAccountDisable,
  handleAccountEnable,
  handleEmployeeAdd,
  handleEmployeeRemove,
  handleEmployeeUpdate,
} from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Col, Drawer, Input, message, Popconfirm, Row, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

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
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [roles, setRoles] = useState({});
  const [modalTitle, setModalTitle] = useState('新建账户');

  useEffect(() => {
    getPlatformRoleList().then((res) => {
      let valueEnum = {};
      res.data.map((item) => {
        valueEnum[item.roleId] = item.roleName;
        return item;
      });
      setRoles(valueEnum);
    });
  }, []);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns = [
    {
      title: '账户名',
      dataIndex: 'account',
      valueType: 'textarea',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '职位',
      dataIndex: 'job',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '停用',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Processing',
        },
      },
    },
    {
      title: '账号创建时间',
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
      search: false,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        let renderArr = [
          <a
            key="config"
            onClick={() => {
              handleModalOpen(true);
              setModalTitle('编辑账户');
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
        ];
        if (record.accountType !== 1) {
          renderArr.push(
            <Popconfirm
              style={{ display: 'none' }}
              title="确定要删除该企业吗？"
              onConfirm={async () => {
                await handleEmployeeRemove({
                  userId: record.userId,
                });
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              <a>删除</a>
            </Popconfirm>,
          );
        }
        if (record.status === 1) {
          renderArr.push(
            <Popconfirm
              title="确定要禁用该账号吗？"
              onConfirm={async () => {
                await handleAccountDisable({
                  userId: record.userId,
                });
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              <a>禁用</a>
            </Popconfirm>,
          );
        } else {
          renderArr.push(
            <Popconfirm
              title="确定要启用该账号吗？"
              onConfirm={async () => {
                await handleAccountEnable({
                  userId: record.userId,
                });
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            >
              <a>启用</a>
            </Popconfirm>,
          );
        }
        return renderArr;
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
              setCurrentRow(undefined);
              setTimeout(() => {
                handleModalOpen(true);
                if (modalFormRef.current) {
                  setModalTitle('新建账户');
                  modalFormRef.current.resetFields();
                }
              }, 200);
            }}
          >
            <PlusOutlined /> 创建账号
          </Button>,
        ]}
        request={getEmployeeList}
        columns={columns}
        rowSelection={false}
      />
      <ModalForm
        {...formItemLayout}
        title={modalTitle}
        width="400px"
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
            roleIdList: [value.roleIdList],
          };
          delete payload.method;
          let result = {};
          if (modalTitle === '编辑账户') {
            result = await handleEmployeeUpdate({
              ...payload,
              roleId: currentRow?.roleId,
              userId: currentRow.userId,
            });
          } else {
            result = await handleEmployeeAdd(payload as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑账户' ? '修改成功' : '创建成功');
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
              message: '请输入账户名',
            },
          ]}
          label="账户名"
          width="md"
          name="account"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入姓名',
            },
          ]}
          label="姓名"
          width="md"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入手机号码',
            },
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号！',
            },
          ]}
          label="手机号码"
          width="md"
          name="phoneNumber"
        />
        <ProFormText label="职位" width="md" name="job" />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请勾选角色',
            },
          ]}
          name="roleIdList"
          width="md"
          label="角色"
          valueEnum={roles}
          value={currentRow?.roleNames}
        />
        {modalTitle === '新建账户' ? (
          <ProFormText
            rules={[
              {
                required: true,
                message: '请输入初始密码',
              },
            ]}
            label="初始密码"
            width="md"
            name="password"
          />
        ) : null}
      </ModalForm>

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
