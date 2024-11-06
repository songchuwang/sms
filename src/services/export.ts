// src/services/export.js
import { message } from 'antd';
import axios from 'axios';

export async function exportFile(url, params = {}) {
  try {
    const response = await axios({
      url: url, // 替换为你的后端接口地址
      method: 'GET',
      data: params,
      responseType: 'blob', // 关键：设置响应类型为 blob
    });

    console.log('file 导出', response);

    const blob = new Blob([response.data], {
      type: 'application/vnd.ms-excel;charset=utf-8', // 根据实际文件类型设置
    });

    // 从 response 的 headers 中获取文件名，也可以自己定义文件名
    const fileName = response.headers['content-disposition'].split('=');

    // 创建一个链接并下载文件
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = decodeURI(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    message.error('文件导出失败');
    console.error('Error exporting file:', error);
  }
}
