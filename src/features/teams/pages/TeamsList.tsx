import React, { useState } from 'react';
import { Card, Button, Input, Modal, Form, List, Avatar, Tag, Popconfirm, Select, Skeleton, Empty, Row, Col, App as AntdApp } from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  CrownOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation
} from '../api/teamApi';
import { useGetUsersQuery } from '../../profile/api/userApi';
import { useAppSelector } from '../../../app/hooks';
import { cn } from '../../../utils/cn';

export const TeamsList: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { data: teams, isLoading } = useGetTeamsQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ limit: 100 });

  const [createTeam, { isLoading: isCreatingTeam }] = useCreateTeamMutation();
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();
  const [addMember, { isLoading: isAddingMember }] = useAddTeamMemberMutation();
  const [removeMember, { isLoading: isRemovingMember }] = useRemoveTeamMemberMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTeamId, setActiveTeamId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  const users = usersData?.data || [];
  const activeTeam = teams?.find((t: any) => t.id === activeTeamId);

  const handleCreateTeam = async (values: any) => {
    try {
      await createTeam(values).unwrap();
      message.success('Team created successfully');
      setCreateModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create team');
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    try {
      await deleteTeam(teamId).unwrap();
      message.success('Team deleted successfully');
      if (activeTeamId === teamId) {
        setActiveTeamId(null);
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete team');
    }
  };

  const handleAddMember = async (values: any) => {
    if (!activeTeamId) return;
    try {
      await addMember({
        teamId: activeTeamId,
        userId: values.userId,
        role: values.role || 'member'
      }).unwrap();
      message.success('Team member added successfully');
      form.setFieldValue('userId', undefined);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!activeTeamId) return;
    try {
      await removeMember({ teamId: activeTeamId, userId }).unwrap();
      message.success('Member removed from team');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to remove member');
    }
  };

  const isOwnerOrAdmin = (team: any) => {
    return team.owner_id === currentUser?.id || currentUser?.role === 'maintainer' || currentUser?.role === 'admin';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton.Button active size="large" className="w-48" />
          <Skeleton.Button active size="large" className="w-32" />
        </div>
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((n) => (
            <Col xs={24} md={8} key={n}>
              <Card className="shadow-sm border-none"><Skeleton active paragraph={{ rows: 4 }} /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <TeamOutlined className="text-primary" /> Teams
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Collaborate, manage permissions, and link projects with workspaces.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateModalOpen(true)}
        >
          Create Team
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={activeTeamId ? 10 : 24} className="transition-all duration-300">
          <Row gutter={[16, 16]}>
            {teams?.length === 0 ? (
              <Col span={24}>
                <Card className="shadow-sm border-none py-12 text-center">
                  <Empty description="No teams created yet" />
                  <Button className="mt-4" type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
                    Create Team
                  </Button>
                </Card>
              </Col>
            ) : (
              teams?.map((team: any) => {
                const isActive = team.id === activeTeamId;
                const membersCount = team.members_count || team.members?.length || 0;
                return (
                  <Col span={24} key={team.id}>
                    <Card
                      variant="borderless"
                      className={cn(
                        "shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4",
                        isActive ? "border-l-indigo-600 bg-indigo-50/5" : "border-l-transparent"
                      )}
                      onClick={() => setActiveTeamId(team.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white hover:text-primary transition-colors flex items-center gap-2">
                            {team.name}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm max-w-lg line-clamp-2">
                            {team.description || 'No description provided.'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1">
                              <CrownOutlined className="text-yellow-500" /> Owner: <strong>{team.owner_name}</strong>
                            </span>
                            <span>•</span>
                            <span>{membersCount} Members</span>
                          </div>
                        </div>
                        {isOwnerOrAdmin(team) && (
                          <Popconfirm
                            title="Delete this team?"
                            description="All projects linked to this team will be unlinked."
                            onConfirm={(e) => {
                              e?.stopPropagation();
                              handleDeleteTeam(team.id);
                            }}
                            onPopupClick={(e) => e.stopPropagation()}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true, loading: isDeletingTeam }}
                          >
                            <Button
                              danger
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Popconfirm>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </Col>

        {activeTeam && (
          <Col xs={24} lg={14}>
            <Card variant="borderless" className="shadow-sm border border-gray-800" title={
              <div className="flex justify-between items-center w-full">
                <span className="text-white font-bold flex items-center gap-2">
                  <SolutionOutlined /> Members list — {activeTeam.name}
                </span>
                <Button size="small" type="text" onClick={() => setActiveTeamId(null)}>Close details</Button>
              </div>
            }>
              {isOwnerOrAdmin(activeTeam) && (
                <div className="mb-6 bg-[var(--bg-secondary)] p-4 rounded-xl border border-gray-800">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1">
                    <UserAddOutlined className="text-primary" /> Add New Member
                  </h4>
                  <Form layout="inline" onFinish={handleAddMember} className="w-full gap-2">
                    <Form.Item
                      name="userId"
                      rules={[{ required: true, message: 'Select a user' }]}
                      className="flex-1 min-w-[200px]"
                    >
                      <Select
                        placeholder="Search users..."
                        loading={isUsersLoading}
                        showSearch
                        optionFilterProp="label"
                        options={users
                          .filter((u: any) => u.id !== currentUser?.id)
                          .map((u: any) => ({
                            value: u.id,
                            label: `👤 ${u.name} (${u.email})`
                          }))
                        }
                      />
                    </Form.Item>
                    <Form.Item name="role" className="w-[120px]">
                      <Select defaultValue="member">
                        <Select.Option value="member">Member</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={isAddingMember} icon={<PlusOutlined />}>
                        Add
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}

              <List
                dataSource={activeTeam.members || []}
                renderItem={(member: any) => (
                  <List.Item
                    className="py-3 px-1 hover:bg-white/5 rounded-lg transition-colors border-b border-gray-800 last:border-none"
                    actions={[
                      isOwnerOrAdmin(activeTeam) && member.user_id !== activeTeam.owner_id && (
                        <Popconfirm
                          title="Remove member?"
                          onConfirm={() => handleRemoveMember(member.user_id)}
                          okText="Remove"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true, loading: isRemovingMember }}
                        >
                          <Button danger type="text" icon={<UserDeleteOutlined />} />
                        </Popconfirm>
                      )
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={member.user_avatar} icon={<CrownOutlined />} className="bg-indigo-600" />}
                      title={
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{member.user_name}</span>
                          {member.user_id === activeTeam.owner_id ? (
                            <Tag color="gold" icon={<CrownOutlined />}>Owner</Tag>
                          ) : (
                            <Tag color={member.role === 'admin' ? 'blue' : 'default'} className="capitalize">{member.role}</Tag>
                          )}
                        </div>
                      }
                      description={<span className="text-xs text-[var(--text-secondary)]">{member.user_email}</span>}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No members in this team.' }}
              />
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        title="Create New Team"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        okText="Create Team"
        confirmLoading={isCreatingTeam}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTeam} className="mt-4">
          <Form.Item
            name="name"
            label="Team Name"
            rules={[{ required: true, message: 'Please input the team name!' }]}
          >
            <Input size="large" placeholder="E.g. Engineering, Marketing, Operations" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Describe the workspace or department..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
