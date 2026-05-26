import React, { useState } from 'react';
import { Card, Table, Select, Tag, Button, Tabs, Space, Popconfirm, Avatar, App as AntdApp } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useGetUsersQuery } from '../../profile/api/userApi';
import {
  useUpdateUserRoleMutation,
  useToggleAccountLockMutation,
  useDeleteUserMutation,
  useGetSystemLogsQuery
} from '../api/adminApi';

const { Option } = Select;
const { TabPane } = Tabs;

export const AdminPage: React.FC = () => {
  const [usersPage, setUsersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ page: usersPage, limit: 10 });
  const { data: logsData, isLoading: isLogsLoading } = useGetSystemLogsQuery({ page: logsPage, limit: 10 });

  const [updateUserRole] = useUpdateUserRoleMutation();
  const [toggleAccountLock] = useToggleAccountLockMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { message } = AntdApp.useApp();

  const handleRoleChange = async (userId: string, newRole: 'contributor' | 'maintainer') => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      message.success('User role updated successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleLock = async (userId: string, isCurrentlyLocked: boolean) => {
    try {
      await toggleAccountLock({ id: userId, lock: !isCurrentlyLocked }).unwrap();
      message.success(`User ${!isCurrentlyLocked ? 'locked' : 'unlocked'} successfully`);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to lock/unlock user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      message.success('User deleted successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete user');
    }
  };

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: any) => (
        <Space>
          <Avatar src={record.avatar_url} icon={!record.avatar_url && <UserOutlined />} />
          <div>
            <div className="font-semibold text-gray-900">{record.name}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          value={role}
          onChange={(val) => handleRoleChange(record.id, val as any)}
          disabled={record.role === 'admin'}
          style={{ width: 140 }}
        >
          <Option value="contributor">Contributor</Option>
          <Option value="maintainer">Maintainer</Option>
        </Select>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        const isLocked = record.locked_until && new Date(record.locked_until) > new Date();
        return (
          <Tag color={isLocked ? 'red' : 'green'}>
            {isLocked ? 'Locked' : 'Active'}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.role === 'admin') return null;
        const isLocked = record.locked_until && new Date(record.locked_until) > new Date();
        return (
          <Space>
            <Button
              type="text"
              icon={isLocked ? <UnlockOutlined className="text-green-500" /> : <LockOutlined className="text-orange-500" />}
              onClick={() => handleToggleLock(record.id, !!isLocked)}
            />
            <Popconfirm
              title="Delete user?"
              description="This will permanently delete this user account."
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const logColumns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'User',
      key: 'message',
      render: (_: any, record: any) => (
        <span>{record.message}</span>
      ),
    },
  ];

  return (
    <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight m-0 flex items-center gap-2">
          <SettingOutlined /> Admin Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage platform users, permissions, and inspect system audit logs.</p>
      </div>

      <Tabs defaultActiveKey="users" size="large">
        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <UserOutlined /> User Management
            </span>
          }
          key="users"
        >
          <Table
            loading={isUsersLoading}
            columns={userColumns}
            dataSource={usersData?.data || []}
            rowKey="id"
            pagination={{
              current: usersPage,
              pageSize: 10,
              total: usersData?.meta?.total || 0,
              onChange: (page) => setUsersPage(page),
            }}
          />
        </TabPane>

        <TabPane
          tab={
            <span className="flex items-center gap-2">
              <HistoryOutlined /> Audit Logs
            </span>
          }
          key="logs"
        >
          <Table
            loading={isLogsLoading}
            columns={logColumns}
            dataSource={logsData?.data || []}
            rowKey="id"
            pagination={{
              current: logsPage,
              pageSize: 10,
              total: logsData?.meta?.total || 0,
              onChange: (page) => setLogsPage(page),
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};
