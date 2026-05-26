import React from 'react';
import { Card, Form, Input, Button, Tabs, Avatar, Row, Col, App as AntdApp } from 'antd';
import { UserOutlined, MailOutlined, KeyOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { useGetProfileQuery, useUpdateProfileMutation } from '../api/userApi';
import { useChangePasswordMutation } from '../../auth/api/authApi';

const { TextArea } = Input;

export const ProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { message } = AntdApp.useApp();

  React.useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        name: profile.name,
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, profileForm]);

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile(values).unwrap();
      message.success('Profile updated successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return <Card loading variant="borderless" className="shadow-sm max-w-4xl mx-auto rounded-3xl" />;
  }

  const items = [
    {
      key: 'edit-profile',
      label: (
        <span className="flex items-center gap-2 px-4 py-1 text-base">
          <EditOutlined /> Edit Profile
        </span>
      ),
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          size="large"
          className="pt-4 animate-fadeIn"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label={<span className="font-semibold text-gray-700 dark:text-gray-300">Full Name</span>}
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="Enter your name" className="rounded-xl" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="avatar_url"
                label={<span className="font-semibold text-gray-700 dark:text-gray-300">Avatar Image URL</span>}
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="https://example.com/avatar.jpg" className="rounded-xl" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="bio"
                label={<span className="font-semibold text-gray-700 dark:text-gray-300">Bio</span>}
                rules={[{ max: 255, message: 'Bio cannot exceed 255 characters' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="rounded-xl resize-none"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 mt-6 text-right">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 h-12 px-8 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'change-password',
      label: (
        <span className="flex items-center gap-2 px-4 py-1 text-base">
          <KeyOutlined /> Security
        </span>
      ),
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          size="large"
          className="pt-4 max-w-lg mx-auto animate-fadeIn"
        >
          <Form.Item
            name="currentPassword"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Current Password</span>}
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">New Password</span>}
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password placeholder="Enter new password" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</span>}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" className="rounded-xl" />
          </Form.Item>

          <Form.Item className="mb-0 mt-8 text-right">
            <Button
              type="primary"
              htmlType="submit"
              icon={<KeyOutlined />}
              loading={isChangingPassword}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 border-0 h-12 px-8 rounded-xl font-semibold shadow-lg hover:shadow-gray-500/30 transition-all duration-300"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <Row gutter={[32, 32]}>
        {/* Left Column: Profile Card */}
        <Col xs={24} lg={8}>
          <Card 
            variant="borderless" 
            className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl h-full"
          >
            <div className="flex flex-col items-center p-4 space-y-6">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <Avatar
                  size={160}
                  src={profile?.avatar_url}
                  icon={!profile?.avatar_url && <UserOutlined />}
                  className="relative border-4 border-white dark:border-gray-800 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-5xl"
                />
              </div>
              <div className="text-center space-y-3 w-full">
                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 m-0">
                  {profile?.name}
                </h1>
                <div className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-900/50 py-2.5 px-4 rounded-full border border-gray-100 dark:border-gray-800 mx-auto w-max max-w-full">
                  <MailOutlined className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium text-sm truncate">
                    {profile?.email}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                    {profile?.role}
                  </span>
                </div>
                {profile?.bio && (
                  <p className="pt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-2">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Settings Tabs */}
        <Col xs={24} lg={16}>
          <Card 
            variant="borderless" 
            className="shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden min-h-full"
          >
            <div className="p-2 sm:p-4">
              <Tabs 
                defaultActiveKey="edit-profile" 
                size="large" 
                className="custom-tabs w-full"
                items={items}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
