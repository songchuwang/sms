import {
  addRule,
  exportFile,
  getBookGrouptList,
  getGrouptList,
  handleBookGroupAdd,
  handleContactAdd,
  handleContactMove,
  handleContactRemove,
  handleContactUpdate,
  handleGroupUpdate,
  updateRule,
} from '@/services/ant-design-pro/api';
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsActionType,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  GridContent,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Card, Col, Drawer, Menu, message, Popconfirm, Row, Space } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
const downLoadUrl = '/api/v1/admin/business/address/book/export';

const useStyles = createStyles(({}) => {
  return {
    menuBox: {},
    groupBox: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      '.ant-menu': {
        // background:'red',
        'border-inline-end': 'none !important',
      },
    },
    groupItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '10px',
      span: {
        fontSize: 18,
      },
    },
    tabsCard: {
      '.ant-card-body': { padding: 0 },
    },
  };
});

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

const TableList: React.FC = (props) => {
  console.log('TableList', props);

  const actionDesRef = useRef<ProDescriptionsActionType>();
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  // const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [selectedRowsKeysState, setSelectedRowKeys] = useState<API.RuleListItem[]>([]);
  const [groupData, setGroupData] = useState([]);

  const [contactModalOpen, handleContactModalOpen] = useState<boolean>(false);
  const contactFormRef = useRef<ProFormInstance>();
  const [contactTitle, setContactTitle] = useState('新建联系人');

  const [moveModalOpen, handleMoveModalOpen] = useState<boolean>(false);
  const moveFormRef = useRef<ProFormInstance>();

  const [downloadFileParams, saveDownloadFileParams] = useState({});

  useEffect(() => {
    console.log('groupProps', props, groupData);
    setGroupData(props.groupData);
  }, [props]);

  const handleDownLoadFile = () => {
    console.log('downloadFileParams', downloadFileParams);
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
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      valueType: 'textarea',
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      valueType: 'textarea',
    },
    {
      title: '公司职位',
      dataIndex: 'job',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '通讯组',
      dataIndex: 'groupName',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            handleContactModalOpen(true);
            setContactTitle('编辑联系人');
            setCurrentRow(record);
            if (contactFormRef.current) {
              contactFormRef.current.setFieldsValue(record);
            }
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="del"
          style={{ display: 'none' }}
          title="确定要删除该联系人吗？"
          onConfirm={async () => {
            let payload = {
              idList: [record.id],
            };
            await handleContactRemove(payload);
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
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleContactModalOpen(true);
              if (contactFormRef.current) {
                // setModalTitle('新建账户');
                contactFormRef.current.resetFields();
              }
            }}
          >
            <PlusOutlined /> 添加联系人
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              if (!selectedRowsKeysState.length) {
                message.warning('请先勾选要移动的联系人');
                return;
              }
              handleMoveModalOpen(true);
            }}
          >
            <RetweetOutlined /> 移动分组
          </Button>,
          <Popconfirm
            key="removeContact"
            style={{ display: 'none' }}
            title="确定要删除选定的联系人吗？"
            onConfirm={async () => {
              if (!selectedRowsKeysState.length) {
                message.warning('请先勾选要删除的联系人');
                return;
              }
              let payload = {
                idList: selectedRowsKeysState,
              };
              await handleContactRemove(payload);
              setSelectedRowKeys([]);
              setSelectedRows([]);
              message.success('删除成功');
              if (actionRef.current) {
                actionRef.current.reload();
              }

              // let payload = {
              //   idList: [record.id]
              // }
              // await handleContactRemove(payload);
              // if (actionRef.current) {
              //   actionRef.current.reload();
              // }
            }}
          >
            <Button type="primary" key="primary">
              <DeleteOutlined /> 批量删除
            </Button>
          </Popconfirm>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleDownLoadFile();
            }}
          >
            <CloudDownloadOutlined /> 导出列表
          </Button>,
        ]}
        params={{
          groupId: props.groupProps.groupId,
        }}
        request={(params) => {
          console.log('paramsparams', params);
          let payload = {
            ...params,
            pageNum: params.current,
            // pageSize: 10,
            // type: statisticsType,
          };
          delete payload.current;
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          return getGrouptList(payload);
        }}
        // request={getGrouptList}
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
        {...formItemLayout}
        title={contactTitle}
        width="400px"
        open={contactModalOpen}
        formRef={contactFormRef}
        onOpenChange={handleContactModalOpen}
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
          // let payload = {
          //   ...value,
          //   roleIdList: [value.roleIdList],
          // };
          // delete payload.method;
          let result = {};
          if (contactTitle === '编辑联系人') {
            result = await handleContactUpdate({
              ...value,
              id: currentRow?.id,
            });
          } else {
            result = await handleContactAdd(value as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(contactTitle === '编辑联系人' ? '修改成功' : '添加成功');
            props.updateGroup();
            handleContactModalOpen(false);
            if (contactFormRef.current) {
              contactFormRef.current.resetFields();
            }
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
              message: '姓名为必填项',
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
              message: '手机号为必填项',
            },
          ]}
          label="手机号"
          width="md"
          name="phoneNumber"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '所属公司为必填项',
            },
          ]}
          label="所属公司"
          width="md"
          name="company"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '公司职务为必填项',
            },
          ]}
          label="公司职务"
          width="md"
          name="job"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '邮箱为必填项',
            },
            {
              pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: '不合法的邮箱',
            },
          ]}
          label="邮箱"
          width="md"
          name="email"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择通讯组',
            },
          ]}
          name="groupId"
          width="md"
          label="通讯组"
          valueEnum={groupData}
        />
      </ModalForm>
      {/* 移动分组 */}
      <ModalForm
        {...formItemLayout}
        title={'移动分组'}
        width="400px"
        open={moveModalOpen}
        formRef={moveFormRef}
        onOpenChange={handleMoveModalOpen}
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
          console.log('moveValue', value, selectedRowsKeysState);
          let result = {};
          let payload = {
            ...value,
            idList: selectedRowsKeysState,
          };
          result = await handleContactMove(payload);
          if (result.code === '200') {
            message.success('移动成功');
            props.updateGroup();
            handleMoveModalOpen(false);
            setSelectedRowKeys([]);
            setSelectedRows([]);
            // if (moveFormRef.current) {
            //   moveFormRef.current.resetFields();
            // }
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(result.msg);
          }

          // if (contactTitle === '编辑联系人') {
          //   result = await handleContactUpdate({
          //     ...value,
          //     id: currentRow?.id,
          //   });
          // } else {
          //   result = await handleContactAdd(value as API.RuleListItem);
          // }
          // if (result.code === '200') {
          //   message.success(contactTitle === '编辑联系人' ? '修改成功' : '添加成功');
          //   props.updateGroup()
          //   handleContactModalOpen(false);
          //   if (contactFormRef.current) {
          //     contactFormRef.current.resetFields();
          //   }
          //   if (actionRef.current) {
          //     actionRef.current.reload();
          //   }
          // } else {
          //   message.error(result.msg);
          // }
        }}
      >
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择通讯组',
            },
          ]}
          name="groupId"
          width="md"
          label="通讯组"
          valueEnum={groupData}
        />
        <span>当前已选择{selectedRowsKeysState.length}人</span>
      </ModalForm>
      <ModalForm
        title={'短信审核'}
        width="400px"
        open={examineModalOpen}
        onOpenChange={handleExamineModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleExamineModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
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

const Center: React.FC = () => {
  const { styles } = useStyles();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);

  const [modalTitle, handleUpdateModalTitle] = useState<string>('新建通讯录分组');

  const [menuList, setMenuList] = useState([]);

  const [currentGroupItem, setCurrentGroupItem] = useState(null);

  const [groupProps, updatePage] = useState({});

  const [groupData, setGroupData] = useState({});
  // 新建分组ref
  const createGroupRef = useRef<ProFormInstance>();

  const getBookGrouptListFn = () => {
    getBookGrouptList().then((res) => {
      console.log('getBookGrouptList', res);
      let data = res.data || [];

      let valueEnum = {};
      data.map((item) => {
        valueEnum[item.groupId] = item.groupName;
        return item;
      });
      setGroupData(valueEnum);

      let menuChildren = data.map((item, index) => {
        return {
          key: index,
          label: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
              }}
              onClick={() => {
                updatePage(item);
              }}
            >
              <span>
                {item.groupName}({item.count})
              </span>
              <EditOutlined
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCreateModalOpen(true);
                  handleUpdateModalTitle('编辑通讯录分组');
                  setCurrentGroupItem(item);
                  if (createGroupRef.current) {
                    createGroupRef.current.setFieldsValue({
                      name: item.groupName,
                    });
                  }
                }}
                style={{ color: '#1890ff' }}
              />
            </div>
          ),
        };
      });
      setMenuList([
        {
          key: 'grp',
          label: '通讯录',
          type: 'group',
          children: menuChildren,
        },
      ]);
    });
  };

  useEffect(() => {
    getBookGrouptListFn();
  }, []);

  return (
    <GridContent>
      <Row gutter={2}>
        <Col lg={4} md={24} flex={1}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
              height: '100%',
            }}
            loading={false}
          >
            <div className={styles.groupBox}>
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  handleCreateModalOpen(true);
                  handleUpdateModalTitle('新建通讯录分组');
                }}
              >
                <PlusOutlined /> 新建分组
              </Button>
              <Menu
                // onClick={onClick}
                // style={{
                //   width: 256,
                // }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={menuList}
              />
            </div>

            {/* {!loading && currentUser && (
              <div>
                <Divider dashed />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
              </div>
            )} */}
          </Card>
        </Col>
        <Col lg={20} md={24}>
          <Card
            className={styles.tabsCard}
            // bordered={false}
            // tabList={operationTabList}
            // activeTabKey={tabKey}
            // onTabChange={(_tabKey: string) => {
            //   setTabKey(_tabKey as tabKeyType);
            // }}
          >
            <TableList
              groupProps={groupProps}
              groupData={groupData}
              updateGroup={getBookGrouptListFn}
            />
          </Card>
        </Col>
      </Row>
      <ModalForm
        title={modalTitle}
        width="400px"
        formRef={createGroupRef}
        open={createModalOpen}
        onOpenChange={handleCreateModalOpen}
        onFinish={async (value) => {
          console.log('groupName', value);
          let result = {};
          let payload = {
            name: value.name,
          };
          if (modalTitle === '编辑通讯录分组') {
            result = await handleGroupUpdate({
              ...payload,
              groupId: currentGroupItem?.groupId,
            });
          } else {
            result = await handleBookGroupAdd(payload);
          }
          if (result.code === '200') {
            message.success(modalTitle === '编辑通讯录分组' ? '修改成功' : '新增成功');
            handleCreateModalOpen(false);
            await getBookGrouptListFn();
            setTimeout(() => {
              if (createGroupRef.current) {
                createGroupRef.current.resetFields();
              }
            });
          } else {
            message.error(result.msg);
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请填写分组名称',
            },
          ]}
          width="md"
          name="name"
          label="分组名称"
        />
      </ModalForm>
    </GridContent>
  );
};

export default Center;
