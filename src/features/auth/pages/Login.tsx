import React from 'react';
import { Form, Input, Button, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../api/authApi';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../slices/authSlice';

export const Login: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntdApp.useApp();

  const from = (location.state as any)?.from?.pathname || '/';

  const onFinish = async (values: any) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ 
        user: result.user, 
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }));
      message.success('Login successful');
      navigate(from, { replace: true });
    } catch (err: any) {
      message.error(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to continue to DevPulse</p>
      </div>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
            Log in
          </Button>
        </Form.Item>

        <div className="text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
        </div>
      </Form>
    </div>
  );
};
