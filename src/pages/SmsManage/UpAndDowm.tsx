import { addRule, exportFile, getSmsItemList, updateRule } from '@/services/ant-design-pro/api';
import { EditOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';

import React, { useRef, useState } from 'react';
import { history } from 'umi';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

const { TextArea } = Input;

const downLoadUrl = '/api/v1/admin/business/sms/item/export';

// 跳转到指定页面并携带参数
const goToPageWithParams = (mobile) => {
  history.push(`/smsManage/sendSms?mobile=${mobile}`);
};

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
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [selectedRowsKeysState, setSelectedRowKeys] = useState<API.RuleListItem[]>([]);

  const [downloadFileParams, saveDownloadFileParams] = useState({});

  const handleDownLoadFile = () => {
    console.log('downloadFileParams', downloadFileParams);

    exportFile(downLoadUrl, downloadFileParams);
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

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
    },
    {
      title: '发送状态',
      dataIndex: 'stateDesc',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      valueType: 'dateTime',
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
            // handleUpdateModalOpen(true);
            // setCurrentRow(record);
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
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="smsItemId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={(value) => {
          console.log('toolBarRender', value);

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
