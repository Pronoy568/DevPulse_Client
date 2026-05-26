import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, Space, Popconfirm, Row, Col, Tag, Avatar, App as AntdApp } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, UserOutlined } from '@ant-design/icons';
import { 
  useGetProjectsQuery, 
  useCreateProjectMutation, 
  useUpdateProjectMutation, 
  useDeleteProjectMutation 
} from '../api/projectApi';
import { useAppSelector } from '../../../app/hooks';

const { TextArea } = Input;
const { Option } = Select;

export const ProjectsList: React.FC = () => {
  const { data: projectsData, isLoading } = useGetProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const { user } = useAppSelector((state) => state.auth);
  const { message } = AntdApp.useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const isMaintainer = user?.role === 'maintainer' || user?.role === 'admin';
  const projects = projectsData?.data || [];

  const handleCreate = async (values: any) => {
    try {
      await createProject(values).unwrap();
      message.success('Project created successfully');
      setIsCreateOpen(false);
      createForm.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create project');
    }
  };

  const handleEditClick = (project: any) => {
    setCurrentProject(project);
    editForm.setFieldsValue({
      name: project.name,
      description: project.description || '',
      status: project.status || 'active',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateProject({ id: currentProject.id, body: values }).unwrap();
      message.success('Project updated successfully');
      setIsEditOpen(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update project');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id).unwrap();
      message.success('Project deleted successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'archived':
        return 'gray';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight m-0 flex items-center gap-2">
            <FolderOutlined /> Projects
          </h1>
          <p className="text-gray-500 mt-1">Organize issues into projects and track collective milestones.</p>
        </div>
        {isMaintainer && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsCreateOpen(true)}
            size="large"
          >
            Create Project
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card loading variant="borderless" className="shadow-sm rounded-xl" />
      ) : (
        <Row gutter={[24, 24]}>
          {projects.map((project: any) => (
            <Col xs={24} sm={12} lg={8} key={project.id}>
              <Card 
                variant="borderless" 
                className="shadow-sm hover:shadow-md border border-gray-100 rounded-xl transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 m-0 truncate w-3/4">{project.name}</h3>
                    <Tag color={getStatusColor(project.status)}>
                      {project.status || 'active'}
                    </Tag>
                  </div>
                  
                  <p className="text-sm text-gray-500 m-0 line-clamp-3 min-h-[60px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-6 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar size="small" src={project.owner_avatar} icon={!project.owner_avatar && <UserOutlined />} />
                    <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                      {project.owner_name || 'Owner'}
                    </span>
                  </div>

                  {isMaintainer && (
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined className="text-gray-500 hover:text-primary transition-colors" />} 
                        onClick={() => handleEditClick(project)} 
                      />
                      <Popconfirm
                        title="Delete this project?"
                        description="All associated issues will remain but won't be linked to this project."
                        onConfirm={() => handleDelete(project.id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Project Modal */}
      <Modal
        title="Create New Project"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          size="large"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter a project name' }]}
          >
            <Input placeholder="E.g., Client Portal v2" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
          >
            <TextArea rows={4} placeholder="Describe the purpose of this project..." />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsCreateOpen(false)} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        title="Edit Project"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
          size="large"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter a project name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsEditOpen(false)} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
