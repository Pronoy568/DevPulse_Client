import React from 'react';
import { Form, Input, Button, Select, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../api/authApi';

export const Signup: React.FC = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const onFinish = async (values: any) => {
    try {
      await signup(values).unwrap();
      message.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err: any) {
      message.error(err?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-500 mt-2">Join DevPulse today</p>
      </div>

      <Form
        name="signup"
        onFinish={onFinish}
        size="large"
        layout="vertical"
        initialValues={{ role: 'contributor' }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your Password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Select Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select>
            <Select.Option value="contributor">Contributor</Select.Option>
            <Select.Option value="maintainer">Maintainer</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
            Sign up
          </Button>
        </Form.Item>

        <div className="text-center text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </div>
      </Form>
    </div>
  );
};
