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
} from '@/services/ant-design-pro/api';
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import {
  GridContent,
  ModalForm,
  PageContainer,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Card, Col, Menu, message, Popconfirm, Row, Space } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
const downLoadUrl = '/api/v1/admin/business/address/book/export';

const useStyles = createStyles(({}) => {
  return {
    groupBox: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      '.ant-menu': {
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

const TableList: React.FC = (props) => {
  const [examineModalOpen, handleExamineModalOpen] = useState<boolean>(false);

  const [notesModalOpen, handleNotesModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
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
    setGroupData(props.groupData);
  }, [props]);

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
            setTimeout(() => {
              if (contactFormRef.current) {
                contactFormRef.current.setFieldsValue(record);
                setCurrentRow(record);
              }
            });
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
            props.updateGroup();
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
              setCurrentRow(undefined);
              if (contactFormRef.current) {
                setContactTitle('添加联系人');
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
          let payload = {
            ...params,
            pageNum: params.current,
          };
          delete payload.current;
          let downloadFileParams = JSON.parse(JSON.stringify(params));
          delete downloadFileParams.current;
          delete downloadFileParams.pageSize;
          saveDownloadFileParams(downloadFileParams);
          return getGrouptList(payload);
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
          // console.log('handleAccountEdit', value);
          let result = {};
          if (contactTitle === '编辑联系人') {
            result = await handleContactUpdate({
              ...value,
              groupId: value._groupId,
              id: currentRow?.id,
            });
          } else {
            let payload = {
              ...value,
              groupId: value._groupId,
            };
            result = await handleContactAdd(payload as API.RuleListItem);
          }
          if (result.code === '200') {
            message.success(contactTitle === '编辑联系人' ? '修改成功' : '添加成功');
            props.updateGroup(props.groupProps);
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
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号！',
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
          name="_groupId"
          width="md"
          label="通讯组"
          valueEnum={groupData}
          value={currentRow?.groupName}
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
            groupId: value._groupId,
            idList: selectedRowsKeysState,
          };
          result = await handleContactMove(payload);
          if (result.code === '200') {
            message.success('移动成功');
            props.updateGroup(props.groupProps);
            handleMoveModalOpen(false);
            setSelectedRowKeys([]);
            setSelectedRows([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          } else {
            message.error(result.msg);
          }
        }}
      >
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择通讯组',
            },
          ]}
          name="_groupId"
          width="md"
          label="通讯组"
          valueEnum={groupData}
          value={currentRow?.groupName}
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

  const getBookGrouptListFn = (params = {}) => {
    getBookGrouptList().then((res) => {
      let data = res.data || [];
      let valueEnum = {};
      data.map((item) => {
        valueEnum[item.groupId] = item.groupName;
        return item;
      });
      if (res.data && res.data.length) {
        updatePage({ groupId: params?.groupId ? params?.groupId : res.data[0].groupId });
      }
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
                  console.log('_setCurrentGroupItem_', item);
                  setTimeout(() => {
                    if (createGroupRef.current) {
                      createGroupRef.current.setFieldsValue(item);
                    }
                  }, 100);
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
                  if (createGroupRef.current) {
                    createGroupRef.current.resetFields();
                  }
                  handleUpdateModalTitle('新建通讯录分组');
                }}
              >
                <PlusOutlined /> 新建分组
              </Button>
              <Menu
                defaultSelectedKeys={['0']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={menuList}
                style={{ maxHeight: '750px', overflowY: 'auto' }}
              />
            </div>
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
            name: value.groupName,
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
          name="groupName"
          label="分组名称"
        />
      </ModalForm>
    </GridContent>
  );
};

export default Center;
