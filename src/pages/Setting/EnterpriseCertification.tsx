import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Card, Cascader, Divider, Form, message, Result, Upload } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
// import { fakeSubmitForm } from './components/service';
import type { GetProp, UploadProps } from 'antd';
import { areaList } from '../../../public/area';
// const { Paragraph, Text } = Typography;
import { businessSubmit, getBusinessInfo } from '@/services/ant-design-pro/api';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const onAreaChange: CascaderProps<Option>['onChange'] = (value) => {
  console.log(value);
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const BasicForm: FC<Record<string, any>> = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [businessLicense, setBusinessLicense] = useState<string>('');
  const [powerOfAttorney, setPowerOfAttorney] = useState<string>('');
  const [formDisabled, setFormDisabled] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({});

  useEffect(() => {
    getBusinessInfo().then((res) => {
      const result = res.data;
      setBusinessInfo(result);
      setImageUrl(result.businessLicense);
    });
  }, []);

  const handleChange: UploadProps['onChange'] = (info) => {
    console.log('handleChange', info);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const onFinish = async (values: Record<string, any>) => {
    const payload = {
      ...values,
      province: values?.allArea[0],
      city: values?.allArea[1],
      area: values?.allArea[2],
      powerOfAttorney: powerOfAttorney,
      businessLicense:
        (businessLicense && 'https://smscompany.bdcjx.com' + businessLicense) || imageUrl,
    };
    const result = await businessSubmit(payload);
    if (result.code === '200') {
      message.success('提交认证成功，请耐心等待审核结果！');
      setFormDisabled(true);
    } else {
      message.error(result.msg);
    }
  };
  const fileProps: UploadProps = {
    name: 'file',
    action: '/common/dgy/v1/common/file/upload',
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  function customRequest(option) {
    const formData = new FormData();
    formData.append('file', option.file);
    // 这里替换为你的上传接口
    fetch('/common/dgy/v1/common/file/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('customRequest', data);
          setBusinessLicense(data.data);
          option.onSuccess(data.data, option.file);
        } else {
          option.onError(new Error(data.error), option.file);
        }
      })
      .catch((error) => {
        option.onError(error, option.file);
      });
  }
  const customFileRequest = (option) => {
    const formData = new FormData();
    formData.append('file', option.file);
    fetch('/common/dgy/v1/common/file/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPowerOfAttorney(data.data);
          option.onSuccess(data.data, option.file);
        } else {
          option.onError(new Error(data.error), option.file);
        }
      })
      .catch((error) => {
        option.onError(error, option.file);
      });
  };
  return (
    <PageContainer>
      {businessInfo.status === 2 ? (
        <Result
          status="success"
          title="企业认证通过，您发送短信的权限已开通"
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          // extra={[
          //   <Button type="primary" key="console">
          //     Go Console
          //   </Button>,
          //   <Button key="buy">Buy Again</Button>,
          // ]}
        />
      ) : null}
      {businessInfo.status === 3 ? (
        // true ?
        <Result
          status="error"
          title="企业认证未通过，请重新认证"
          // subTitle={`企业认证未通过，请重新认证`}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setBusinessInfo({
                  ...businessInfo,
                  status: 0,
                  reload: false,
                });
              }}
            >
              前往认证
            </Button>,
          ]}
        ></Result>
      ) : null}
      {businessInfo.status === 0 || businessInfo.status === 1 ? (
        <Card bordered={false}>
          {businessInfo.status === 1 ? (
            <Result title="您提交的认证信息正在审核中，请耐心等待审核结果" />
          ) : null}
          <ProForm
            style={{
              margin: 'auto',
              marginTop: 8,
              maxWidth: 600,
            }}
            disabled={formDisabled}
            name="basic"
            layout="vertical"
            // initialValues={businessInfo}
            request={async () => {
              const response = await getBusinessInfo();
              // let data = response.data;
              if (businessInfo.reload !== false) {
                setBusinessInfo(response.data);
              }
              if (businessInfo.status !== 0) {
                setFormDisabled(true);
              } else {
                setFormDisabled(false);
              }
              return {
                name: businessInfo.name,
                allArea: [businessInfo.province, businessInfo.city, businessInfo.area],
                address: businessInfo.address,
              };
            }}
            onFinish={onFinish}
          >
            <ProFormText
              width="md"
              label="公司名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '公司名称未填写',
                },
              ]}
              placeholder="请输入公司名称"
            />
            <Form.Item
              label="公司地址"
              name="allArea"
              rules={[{ required: true, message: '请选择公司地址' }]}
            >
              <Cascader
                style={{ width: 330 }}
                options={areaList}
                onChange={onAreaChange}
                placeholder="请选择公司地址"
              />
            </Form.Item>
            <ProFormText
              width="md"
              label="详细地址"
              name="address"
              rules={[
                {
                  required: true,
                  message: '详细地址未填写',
                },
              ]}
              placeholder="请输入公司详细地址"
            />

            <Form.Item
              label="上传营业执照"
              name="avatar"
              required
              rules={[
                // { required: true, message: '请上传营业执照' },
                {
                  validator: () => {
                    if (imageUrl) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请上传营业执照');
                  },
                },
              ]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={customRequest}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{ width: '100%', maxWidth: 100, height: 'auto', maxHeight: 100 }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="upload"
              label="授权书"
              rules={[
                {
                  required: true,
                  message: '请上传授权书',
                },
              ]}
              // valuePropName="fileList"
              // getValueFromEvent={normFile2}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                <Upload {...fileProps} customRequest={customFileRequest}>
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      'https://smscompany.bdcjx.com/%E7%9F%AD%E4%BF%A1%E5%B9%B3%E5%8F%B0%E6%9C%8D%E5%8A%A1%E7%94%B3%E8%AF%B7%E6%8E%88%E6%9D%83%E4%B9%A6.docx',
                      '_blank',
                    )
                  }
                >
                  下载授权书
                </Button>
              </div>
            </Form.Item>
          </ProForm>
          <Divider
            style={{
              margin: '40px 0 24px',
            }}
          />
          <div>
            {/* <h3>说明</h3> */}
            <p>*请上传可以证明企业资质的营业执照</p>
            <p>*营业执照图片格式需为gif/jpg/jpeg/png格式，文件{'<'}2M</p>
            <p>*授权书需在下载授权书模板填写后上传</p>
            {/* <h4>转账到银行卡</h4>
          <p>
            如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
          </p> */}
          </div>
        </Card>
      ) : null}
    </PageContainer>
  );
};
export default BasicForm;
