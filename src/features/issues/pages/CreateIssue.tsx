import React from 'react';
import { Card, Form, Input, Select, Button, App as AntdApp } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateIssueMutation } from '../api/issueApi';
import { useGetUsersQuery } from '../../profile/api/userApi';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export const CreateIssue: React.FC = () => {
  const [createIssue, { isLoading }] = useCreateIssueMutation();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ limit: 100 });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  const users = usersData?.data || [];

  const onFinish = async (values: any) => {
    try {
      await createIssue(values).unwrap();
      message.success('Issue created successfully');
      navigate('/issues');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create issue');
    }
  };

  return (
    <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl max-w-3xl mx-auto">
      <div className="mb-6">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/issues')} className="px-0 text-gray-500 mb-2">
          Back
        </Button>
        <h1 className="text-2xl font-extrabold tracking-tight m-0">Create New Issue</h1>
        <p className="text-gray-500 mt-1">Report a bug or request a new feature. Markdown is supported in the description.</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ type: 'bug', priority: 'medium' }}
        size="large"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="E.g., Login page is crashing on mobile" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Form.Item
            name="type"
            label="Issue Type"
            rules={[{ required: true, message: 'Please select an issue type' }]}
          >
            <Select placeholder="Select type">
              <Option value="bug">🐛 Bug</Option>
              <Option value="feature_request">💡 Feature Request</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select a priority' }]}
          >
            <Select placeholder="Select priority">
              <Option value="critical">🔴 Critical</Option>
              <Option value="high">🟠 High</Option>
              <Option value="medium">🔵 Medium</Option>
              <Option value="low">⚪ Low</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assignee_id"
            label="Assignee"
          >
            <Select
              placeholder="Assign to..."
              loading={isUsersLoading}
              allowClear
            >
              {users.map((u: any) => (
                <Option key={u.id} value={u.id}>
                  👤 {u.name} ({u.role})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea 
            rows={8} 
            placeholder="Provide detailed information about the issue... (Markdown supported)"
          />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={() => navigate('/issues')} className="mr-4">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Issue
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
