import { Card, Typography } from 'antd';
import './MessagePreview.css'; // 引入自定义样式文件

const { Text } = Typography;

const MessagePreview = ({ content, title }) => {
  return (
    <div className="phone-frame">
      {title || content ? (
        <Card className="message-preview-card">
          {/* <div className="message-header">
          <Text className="message-sender">{sender}</Text>
          <Text className="message-timestamp">{new Date(timestamp).toLocaleString()}</Text>
        </div> */}
          <Text className="message-content">
            {title.trim() ? `【${title}】` : ''} {content}
          </Text>
        </Card>
      ) : null}
    </div>
  );
};

export default MessagePreview;