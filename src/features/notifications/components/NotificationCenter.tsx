import React from 'react';
import { Drawer, List, Button, Avatar, Space, Badge, Empty, Spin } from 'antd';
import { BellOutlined, CheckOutlined, InfoCircleOutlined, MessageOutlined, BugOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation 
} from '../api/notificationApi';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ open, onClose }) => {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
  const navigate = useNavigate();

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id).unwrap();
    }
    
    onClose();

    // Navigate to related issue
    if (notification.reference_type === 'issue' && notification.reference_id) {
      navigate(`/issues/${notification.reference_id}`);
    } else if (notification.reference_type === 'comment' && notification.reference_id) {
      // In a real app, comments belong to issues, let's assume reference_id is issue_id or comment_id.
      // If we only have reference_id, let's navigate to issues.
      navigate(`/issues/${notification.reference_id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <Avatar icon={<MessageOutlined />} className="bg-blue-500" />;
      case 'issue_created':
      case 'issue_assigned':
        return <Avatar icon={<BugOutlined />} className="bg-indigo-500" />;
      default:
        return <Avatar icon={<InfoCircleOutlined />} className="bg-gray-500" />;
    }
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center w-full pr-4">
          <Space>
            <BellOutlined />
            <span>Notifications</span>
            {unreadCount > 0 && <Badge count={unreadCount} style={{ backgroundColor: '#10b981' }} />}
          </Space>
          {unreadCount > 0 && (
            <Button 
              type="text" 
              icon={<CheckOutlined />} 
              onClick={() => markAllAsRead()} 
              loading={isMarkingAll}
              size="small"
              className="text-xs text-primary hover:text-primary-light"
            >
              Mark all read
            </Button>
          )}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      styles={{ body: { padding: 0 } }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-12">
          <Empty description="No notifications yet" />
        </div>
      ) : (
        <List
          dataSource={notifications}
          renderItem={(item: any) => (
            <List.Item
              onClick={() => handleNotificationClick(item)}
              className={`px-6 py-4 cursor-pointer transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50 flex items-start gap-4 ${
                !item.is_read ? 'bg-indigo-50/20 border-l-4 border-l-primary' : ''
              }`}
            >
              {getIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className={`text-sm font-semibold text-gray-900 truncate m-0 ${!item.is_read ? 'font-bold' : ''}`}>
                    {item.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(item.created_at || item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 m-0 line-clamp-2">
                  {item.message}
                </p>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};
