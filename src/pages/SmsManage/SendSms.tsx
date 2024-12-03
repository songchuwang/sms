import {
  BookOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  FormOutlined,
  MailOutlined,
  MobileOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import {
  GridContent,
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';

import {
  getBookGrouptList,
  getBusinessAddressBookList,
  getSignList,
  getTempList,
  sendSms,
} from '@/services/ant-design-pro/api';
import '@umijs/max';
import type { DatePickerProps, GetProps } from 'antd';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Tree,
} from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import MessagePreview from './components/MessagePreview';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { TextArea } = Input;

const { Search } = Input;

const useStyles = createStyles(({}) => {
  return {
    menuBox: {},
    groupBox: {
      display: 'flex',
      flexDirection: 'column',
      '.ant-menu': {
        // background:'red',
        'border-inline-end': 'none !important',
      },
      '.ant-card-body': {
        padding: '14px',
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

const Center: React.FC = () => {
  const { styles } = useStyles();
  const [createModalOpen, handleCreateModalOpen] = useState<boolean>(false);

  const [modalTitle, handleUpdateModalTitle] = useState<string>('新建通讯录分组');

  const [smsContent, setSmsContent] = useState<string>('');

  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [selectedRowsKeysState, setSelectedRowKeys] = useState<API.RuleListItem[]>([]);

  const [numberPoolDataSource, setNumberPool] = useState([]); // 号码池号码

  const [filterNumberPool, setFilterNumberPool] = useState([]); // 号码池号码

  const rechargeRef = useRef<ActionType>();
  const tempRef = useRef<ActionType>();
  const modalFormRef = useRef<ProFormInstance>();

  const proFormRef = useRef();

  const [numberPoolModalOpen, setNumberPoolModalOpen] = useState<boolean>(false);

  const [addressBookModalOpen, setAddressBookModalOpen] = useState<boolean>(false);

  const [phoneIncreaseModalOpen, handlePhoneIncreaseModalOpen] = useState<boolean>(false);

  const [sendType, setSendType] = useState(1);

  // 签名列表相关
  const [signList, setSignList] = useState([]);
  // 当前选中签名，用于右侧模拟展示
  const [currentSign, setCurrentSign] = useState('');

  const [showTime, showTimePicker] = useState(false);

  const [pickTime, setTime] = useState('');

  const location = useLocation();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const [treeData, setTreeData] = useState([]);

  const [filterData, setFilterData] = useState([]);

  const [filterWord, setFilterWord] = useState('');

  const [tempModalOpen, setTempModalOpen] = useState(false);

  useEffect(() => {
    const queryMobile = new URLSearchParams(location.search).get('mobile');
    console.log('queryMobile', queryMobile);
    if (queryMobile?.length) {
      let payload = [];
      let mobileSplit = queryMobile.split(',');
      mobileSplit.map((item) => {
        payload.push({
          mobile: item,
          name: '-',
          group: '-',
        });
        return item;
      });
      setNumberPool(payload);
    }
  }, []);

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    console.log('onOk: ', value);
  };

  const removeArrayEqualItem = (arr1, arr2) => {
    const set2 = new Set(arr2);
    return arr1.filter((item) => !set2.has(item));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log('valuevaluevalue', value);
    if (!value) {
      setFilterData([]);
      setFilterWord(value);
      return;
    }
    const _filterData = treeData.filter((item) => item.groupName.includes(value));
    setFilterWord(value);
    setFilterData(_filterData);
    // const newExpandedKeys = dataList
    //   .map((item) => {
    //     if (item.title.indexOf(value) > -1) {
    //       return getParentKey(item.key, defaultData);
    //     }
    //     return null;
    //   })
    //   .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
    // setExpandedKeys(newExpandedKeys);
    // setSearchValue(value);
    // setAutoExpandParent(true);
  };

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys, e);
    setCheckedKeys(checkedKeys as React.Key[]);
    // setCheckedMenuList([...checkedKeys, ...e.halfCheckedKeys])
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  // 只包含数字和英文逗号
  const validateString = (str) => {
    return /^[0-9,]*$/.test(str);
  };
  function validatePhoneNumber(phoneNumber) {
    return /1[3-9]\d{9}$/.test(phoneNumber);
  }

  useEffect(() => {
    getSignList().then((res) => {
      let result = res.list.map((item) => {
        return {
          label: item.name,
          value: item.signId,
        };
      });
      setSignList(result);
    });
  }, []);
  const onRadioChange = (e) => {
    showTimePicker(e.target.value === '1');
    setSendType(e.target.value);
  };

  const onSignChange = (value) => {
    console.log('onSignChange', signList, value);
    signList.map((item) => {
      if (item.value === value) {
        setCurrentSign(item.label);
      }
      return item;
    });
  };

  // 定义一个函数，用于将对象转换为唯一字符串键
  const getObjectKey = (obj) => {
    // 在这个例子中，我们使用对象的 id 属性作为唯一键
    // 如果你的对象有多个属性需要比较，你可以创建一个更复杂的字符串
    console.log('getObjectKey', obj);

    return obj.mobile.toString();
  };

  const onTextChange = (e) => {
    console.log('Change:', e.target.value);
    setSmsContent(e.target.value);
  };

  const numberPoolColumns = [
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
      title: '手机号码',
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
      title: '通讯录分组',
      dataIndex: 'group',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="filterMobile"
          title="确定要删除吗？"
          onConfirm={async () => {
            console.log('numberPoolDataSource', numberPoolDataSource);
            let filterResult = numberPoolDataSource.filter(
              (item) => !item.mobile.includes(record.mobile),
            );
            setNumberPool(filterResult);
            // await handleRemove(record)
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const tempColumns: ProColumns<API.RuleListItem>[] = [
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
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      ellipsis: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            if (proFormRef.current) {
              setSmsContent(record.content);
              proFormRef.current.setFieldsValue({
                content: record.content,
              });
            }
            // handleModalOpen(true);
            // setModalTitle('编辑模板');
            // setTimeout(() => {
            //   if (modalFormRef.current) {
            //     modalFormRef.current.setFieldsValue(record);
            //     setCurrentRow(record);
            //   }
            // });
          }}
        >
          使用
        </a>,
      ],
    },
  ];

  return (
    <GridContent>
      <Row gutter={2}>
        <Col lg={14} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={false}
          >
            <div className={styles.groupBox}>
              <ProForm
                formRef={proFormRef}
                style={{
                  // margin: 'auto',
                  marginTop: 8,
                  maxWidth: 600,
                }}
                name="basic"
                layout="horizontal"
                initialValues={{
                  public: '1',
                }}
                onValuesChange={(changeValues) => {
                  console.log(changeValues);
                  if (changeValues?.sendType === '1') {
                    showTimePicker(true);
                  } else {
                    showTimePicker(false);
                  }
                }}
                onFinish={async (values) => {
                  let smsPayload = {
                    content: values.content,

                    sendSmsItemList: numberPoolDataSource.map((item) => {
                      return {
                        mobile: item.mobile,
                        name: item.name === '-' || !item.name ? item.mobile : item.name,
                      };
                    }),
                    sendType: showTime ? 1 : 0,
                    signId: values.signId,
                  };
                  if (showTime) {
                    smsPayload['fixedTime'] = pickTime;
                  }

                  let result = await sendSms(smsPayload);
                  if (result.code === '200') {
                    message.success(result.msg);
                  } else {
                    // message.error(result.msg);
                  }
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <MobileOutlined /> 号码池
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      background: '#e6f4ff',
                      boxSizing: 'border-box',
                      padding: '15px',
                      borderRadius: '5px',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      已添加号码数量：{' '}
                      <span style={{ color: '#1890ff' }}>{numberPoolDataSource.length}</span>
                    </span>
                    <Button
                      onClick={() => {
                        setNumberPoolModalOpen(true);
                      }}
                      color="primary"
                      variant="dashed"
                    >
                      查看号码池
                    </Button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      boxSizing: 'border-box',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Button
                        type="link"
                        key="primary"
                        onClick={() => {
                          handlePhoneIncreaseModalOpen(true);
                        }}
                      >
                        <PlusOutlined /> 手动添加
                      </Button>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        type="link"
                        key="primary"
                        onClick={async () => {
                          setAddressBookModalOpen(true);
                          let res = await getBookGrouptList();
                          setTimeout(() => {
                            let filterArr = res.data.map((item) => {
                              return {
                                ...item,
                                itemConNumber: `${item.groupName}(${item.count})`,
                              };
                            });
                            setTreeData(filterArr);
                          });
                        }}
                      >
                        <BookOutlined /> 通讯录导入
                      </Button>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <FormOutlined /> 选择签名
                  </h3>
                  <Form.Item
                    name="signId"
                    label="签名"
                    rules={[
                      {
                        required: true,
                        message: '请选择短信签名',
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择签名"
                      options={signList}
                      onChange={onSignChange}
                      allowClear
                    ></Select>
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <MailOutlined /> 短信内容
                  </h3>
                  <Form.Item
                    name="content"
                    rules={[
                      {
                        required: true,
                        message: '请输入短信内容',
                      },
                    ]}
                  >
                    <TextArea
                      showCount
                      maxLength={500}
                      onChange={onTextChange}
                      placeholder="请输入短信内容"
                      style={{
                        height: 150,
                        resize: 'none',
                      }}
                    />
                  </Form.Item>
                  <Button
                    type="link"
                    key="primary"
                    onClick={() => {
                      // handleModalOpen(true);
                      setTempModalOpen(true);
                    }}
                  >
                    <FileAddOutlined /> 选择短信模板
                  </Button>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3>
                    <ClockCircleOutlined /> 发送时间
                  </h3>
                  <Form.Item
                    key="sendType"
                    name="sendType"
                    // rules={[
                    //   { validator: (rule, value) => {
                    //     console.log('选择校验',rule, value);

                    //     if (value) {
                    //       if (/^[0-9]+$/.test(value)) {
                    //         return Promise.resolve();
                    //       } else {
                    //         return Promise.reject('只能输入数字');
                    //       }
                    //     } else {
                    //       return Promise.resolve();
                    //     }
                    //   }},
                    //   {
                    //     required: true,
                    //     message:'请选择发送时间'
                    //   },
                    // ]}
                  >
                    <Radio.Group onChange={onRadioChange} value={sendType}>
                      <Radio key="Radio0" value="0">
                        即时发送
                      </Radio>
                      <Radio key="Radio1" value="1">
                        定时发送
                      </Radio>
                    </Radio.Group>
                    {showTime ? (
                      <DatePicker
                        showTime
                        onChange={(value, dateString) => {
                          console.log('Selected Time: ', value);
                          console.log(
                            'Formatted Selected Time: ',
                            dateString,
                            new Date(dateString).getTime(),
                          );
                          let timestamp = new Date(dateString).getTime();
                          setTime(timestamp);
                        }}
                        onOk={onOk}
                      />
                    ) : null}
                  </Form.Item>
                </div>
              </ProForm>
            </div>
          </Card>
        </Col>
        <Col lg={10} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={false}
          >
            <div className={styles.groupBox}>
              <MessagePreview
                sender="宋楚望"
                title={currentSign}
                content={smsContent}
                timestamp="2023-04-01T12:00:00Z"
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
      </Row>
      <ModalForm
        title={'手动添加'}
        width="550px"
        formRef={modalFormRef}
        open={phoneIncreaseModalOpen}
        onOpenChange={handlePhoneIncreaseModalOpen}
        onFinish={async (value) => {
          console.log('手动添加', value);
          if (!value.mobile) {
            return message.error('请输入待发送短信的手机号码！');
          } else {
            if (!validateString(value.mobile)) {
              return message.error('存在非法字符，请重新输入！');
            }
          }

          if (value.mobile && value.mobile.trim()) {
            // 使用 Map 对象来去除重复项
            let map = new Map();
            let payload = [];
            let mobileSplit = value.mobile.split(',');
            let checkIsPass = true;
            mobileSplit.map((item) => {
              if (!validatePhoneNumber(item)) {
                checkIsPass = false;
              }
              payload.push({
                mobile: item,
                name: '-',
                group: '-',
              });
              return item;
            });
            if (!checkIsPass) {
              message.error('存在格式错误的手机号，请检查后重新输入！');
              return;
            }
            let arr = [...payload, ...numberPoolDataSource];
            arr.forEach((obj) => {
              let key = getObjectKey(obj);
              // 如果 Map 中还没有这个键，则添加对象
              if (!map.has(key)) {
                map.set(key, obj);
              }
            });
            // 从 Map 中获取去重后的对象数组
            let uniqueObjects = [...map.values()];
            console.log('uniqueObjects', uniqueObjects);
            setNumberPool(uniqueObjects);
            if (modalFormRef.current) {
              modalFormRef.current.resetFields();
            }
            // 1.做合法性校验
            // 2.校验通过后，先拿到号码池数据，然后与当前输入数据做对比，过滤掉重复号码
            // const success = await handleAdd(value as API.RuleListItem);
            // if (success) {
            //   handleModalOpen(false);
            //   if (actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }
          }
        }}
      >
        <ProFormTextArea
          width="100%"
          placeholder="请输入手机号码，多个以英文逗号隔开"
          name="mobile"
        />
      </ModalForm>
      {/* 号码池 */}
      <Modal
        width={1000}
        footer=""
        title="号码池"
        open={numberPoolModalOpen}
        onCancel={() => setNumberPoolModalOpen(false)}
      >
        <ProTable<API.RuleListItem, API.PageParams>
          actionRef={rechargeRef}
          rowKey="mobile"
          options={false}
          onSubmit={(value) => {
            console.log('value', value);
            let _dataSource = numberPoolDataSource.filter((item) =>
              item.mobile.includes(value.mobile),
            );
            console.log('_dataSource', _dataSource);
            setFilterNumberPool(_dataSource);
          }}
          onReset={() => {
            setFilterNumberPool([]);
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                const result = removeArrayEqualItem(numberPoolDataSource, selectedRowsState);
                console.log('removeArrayEqualItem', result);
                setSelectedRows([]);
                setNumberPool(result);
                setSelectedRowKeys([]);
              }}
            >
              删除选中
            </Button>,
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setNumberPool([]);
              }}
            >
              全部删除
            </Button>,
          ]}
          dataSource={filterNumberPool.length ? filterNumberPool : numberPoolDataSource}
          columns={numberPoolColumns}
          rowSelection={{
            selectedRowKeys: selectedRowsKeysState,
            onChange: (keys, selectedRows) => {
              console.log('selectedRowsState', keys, selectedRowsState);
              setSelectedRows(selectedRows);
              setSelectedRowKeys(keys);
            },
          }}
        />
      </Modal>
      {/* 模板导入 */}
      <Modal
        width={1000}
        footer=""
        title="模板导入"
        open={tempModalOpen}
        onCancel={() => setTempModalOpen(false)}
      >
        <ProTable<API.RuleListItem, API.PageParams>
          headerTitle={'查询表格'}
          actionRef={tempRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          options={false}
          request={getTempList}
          columns={tempColumns}
          rowSelection={false}
        />
      </Modal>
      {/* 通讯录导入 */}
      <Modal
        width={300}
        title="通讯录导入"
        open={addressBookModalOpen}
        onCancel={() => setAddressBookModalOpen(false)}
        onOk={async () => {
          let payload = {
            groupId: checkedKeys.join(','),
          };
          let result = await getBusinessAddressBookList(payload);

          if (result.code === '200') {
            let filterNumbers = result.list.map((item) => {
              return {
                mobile: item.phoneNumber,
                name: item.name || '-',
                group: item.groupName || '-',
              };
            });
            setNumberPool([...numberPoolDataSource, ...filterNumbers]);
          }
        }}
      >
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={true}
          defaultExpandAll={true}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={filterWord ? filterData : treeData}
          fieldNames={{
            title: 'itemConNumber',
            key: 'groupId',
          }}
        />
      </Modal>
      <ModalForm
        title={modalTitle}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleCreateModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleCreateModalOpen(false);
            handleUpdateModalTitle(false);
            // if (actionRef.current) {
            //   actionRef.current.reload();
            // }
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
          label="分组名称"
        />
      </ModalForm>
    </GridContent>
  );
};

export default Center;
