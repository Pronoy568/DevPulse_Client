import React, { useState } from 'react';
import { Table, Input, Select, Button, Space, Card, Popconfirm, Tag, App as AntdApp } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetIssuesQuery, useDeleteIssueMutation } from '../api/issueApi';
import { useAppSelector } from '../../../app/hooks';
import { StatusTag, TypeTag } from '../../../components/ui/Tags';
import { IssueStatus, IssueType, IssuePriority } from '../../../types';

const { Option } = Select;

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'red',
  high: 'orange',
  medium: 'blue',
  low: 'default',
};

export const IssuesList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<IssueStatus | undefined>(undefined);
  const [type, setType] = useState<IssueType | undefined>(undefined);
  const [priority, setPriority] = useState<IssuePriority | undefined>(undefined);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const { data: response, isLoading, isFetching } = useGetIssuesQuery({
    page,
    limit,
    search,
    status,
    type,
    priority,
    sort,
  });

  const issues = Array.isArray(response) ? response : response?.data || [];
  const total = Array.isArray(response) ? response.length : response?.meta?.total || 0;

  const [deleteIssue] = useDeleteIssueMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id).unwrap();
      message.success('Issue deleted successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete issue');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <a onClick={() => navigate(`/issues/${record.id}`)} className="font-semibold text-primary hover:underline cursor-pointer">
          {text}
        </a>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: IssueType) => <TypeTag type={type} />,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: string) => p ? (
        <Tag color={PRIORITY_COLORS[p] || 'default'} className="m-0 border-none font-semibold text-[10px] uppercase">
          {p}
        </Tag>
      ) : <span className="text-gray-400">—</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: IssueStatus) => <StatusTag status={status} />,
    },
    {
      title: 'Reporter',
      key: 'reporter',
      width: 140,
      render: (_: any, record: any) => record.reporter_name || record.reporter?.name || 'Unknown',
    },
    {
      title: 'Created',
      key: 'createdAt',
      width: 120,
      render: (_: any, record: any) => new Date(record.created_at || record.createdAt || '').toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/issues/${record.id}`)} 
          />
          {(user?.role === 'maintainer' || user?.role === 'admin') && (
            <Popconfirm
              title="Delete the issue"
              description="Are you sure to delete this issue?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold m-0">Issues</h1>
          <p className="text-gray-500 m-0 text-sm">List view · {total} issues</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<AppstoreOutlined />} onClick={() => navigate('/issues')} title="Board view" />
          <Button type="primary" onClick={() => navigate('/issues/create')}>
            New Issue
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search issues..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="w-full sm:w-64"
          allowClear
          onPressEnter={(e: any) => setSearch(e.target.value)}
          onBlur={(e: any) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Status"
          className="w-full sm:w-36"
          allowClear
          onChange={(value) => setStatus(value)}
        >
          <Option value="open">Open</Option>
          <Option value="in_progress">In Progress</Option>
          <Option value="resolved">Resolved</Option>
        </Select>
        <Select
          placeholder="Type"
          className="w-full sm:w-36"
          allowClear
          onChange={(value) => setType(value)}
        >
          <Option value="bug">Bug</Option>
          <Option value="feature_request">Feature Request</Option>
        </Select>
        <Select
          placeholder="Priority"
          className="w-full sm:w-36"
          allowClear
          onChange={(value) => setPriority(value)}
        >
          <Option value="critical">Critical</Option>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
        <Select
          defaultValue="newest"
          className="w-full sm:w-36"
          onChange={(value) => setSort(value as 'newest' | 'oldest')}
        >
          <Option value="newest">Newest First</Option>
          <Option value="oldest">Oldest First</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={issues}
        rowKey={(record) => record.id || record._id}
        loading={isLoading || isFetching}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </Card>
  );
};
