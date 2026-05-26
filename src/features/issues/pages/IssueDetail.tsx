import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Select, Skeleton, Popconfirm, Divider, Avatar, Tabs, List, Badge, App as AntdApp } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetIssueByIdQuery, 
  useUpdateIssueMutation, 
  useUpdateIssueStatusMutation, 
  useDeleteIssueMutation,
  useGetIssueCommentsQuery,
  useAddIssueCommentMutation,
  useGetIssueHistoryQuery,
  useGetIssueAttachmentsQuery,
  useUploadIssueAttachmentMutation,
  useDeleteIssueAttachmentMutation,
  issueApi
} from '../api/issueApi';
import { useGetUsersQuery } from '../../profile/api/userApi';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { StatusTag, TypeTag } from '../../../components/ui/Tags';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  CloseOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  HistoryOutlined,
  UserOutlined,
  PaperClipOutlined,
  UploadOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../../utils/cn';
import { useSocket } from '../../../providers/SocketProvider';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { socket, onlineUsers } = useSocket();

  const { data: issue, isLoading } = useGetIssueByIdQuery(id as string, { skip: !id });
  const { data: comments, isLoading: isCommentsLoading } = useGetIssueCommentsQuery(id as string, { skip: !id });
  const { data: history, isLoading: isHistoryLoading } = useGetIssueHistoryQuery(id as string, { skip: !id });
  const { data: attachments, isLoading: isAttachmentsLoading } = useGetIssueAttachmentsQuery(id as string, { skip: !id });
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ limit: 100 });

  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
  const [updateStatus, { isLoading: isStatusUpdating }] = useUpdateIssueStatusMutation();
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddIssueCommentMutation();
  const [uploadAttachment, { isLoading: isUploadingAttachment }] = useUploadIssueAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeletingAttachment }] = useDeleteIssueAttachmentMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  const users = usersData?.data || [];

  const isMaintainer = user?.role === 'maintainer' || user?.role === 'admin';
  const isReporter = issue?.reporterId === user?.id || (issue?.reporter as any)?._id === user?.id || issue?.reporter?.id === user?.id; 
  const canEdit = isMaintainer || (isReporter && issue?.status === 'open');

  // Multi-tab active online user checks
  const isAssigneeOnline = issue?.assignee_id ? onlineUsers.includes(Number(issue.assignee_id)) : false;
  const isReporterOnline = issue?.reporter_id ? onlineUsers.includes(Number(issue.reporter_id)) : 
                          (issue?.reporter?.id ? onlineUsers.includes(Number(issue.reporter.id)) : false);

  // Socket setup for joining unique room and live comment syncing
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('issue:join', id);

    const handleNewComment = (comment: any) => {
      dispatch(
        issueApi.util.updateQueryData('getIssueComments', id, (draft) => {
          if (!draft.some((c: any) => c.id === comment.id)) {
            draft.push(comment);
          }
        })
      );
    };

    socket.on('comment:new', handleNewComment);

    return () => {
      socket.off('comment:new', handleNewComment);
      socket.emit('issue:leave', id);
    };
  }, [socket, id, dispatch]);

  useEffect(() => {
    if (issue && isEditing) {
      form.setFieldsValue({
        title: issue.title,
        type: issue.type,
        priority: issue.priority,
        assignee_id: issue.assignee_id,
        description: issue.description,
      });
    }
  }, [issue, isEditing, form]);

  const handleUpdate = async (values: any) => {
    try {
      await updateIssue({ id: id as string, body: values }).unwrap();
      message.success('Issue updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update issue');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: id as string, status: newStatus as any }).unwrap();
      message.success('Status updated successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssue(id as string).unwrap();
      message.success('Issue deleted successfully');
      navigate('/issues');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete issue');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({ issueId: id as string, content: commentText }).unwrap();
      setCommentText('');
      message.success('Comment added');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to add comment');
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      message.error('File size must be less than 10MB');
      return;
    }

    try {
      await uploadAttachment({ issueId: id as string, file }).unwrap();
      message.success('File attached successfully');
      // Reset input value
      e.target.value = '';
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to upload attachment');
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    try {
      await deleteAttachment({ issueId: id as string, attachmentId }).unwrap();
      message.success('Attachment deleted successfully');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete attachment');
    }
  };

  if (isLoading) {
    return <Card className="shadow-sm border-none"><Skeleton active avatar paragraph={{ rows: 8 }} /></Card>;
  }

  if (!issue) {
    return (
      <Card className="shadow-sm border-none text-center py-12">
        <h2 className="text-xl text-gray-500">Issue not found</h2>
        <Button className="mt-4" onClick={() => navigate('/issues')}>Back to Issues</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <Card variant="borderless" className="shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/issues')} className="px-0 text-gray-500 hover:text-primary transition-colors">
              Back
            </Button>
            <div className="flex gap-2">
              {!isEditing && canEdit && (
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              {isMaintainer && (
                <Popconfirm
                  title="Delete this issue?"
                  description="This action cannot be undone."
                  onConfirm={handleDelete}
                  okText="Yes, Delete"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger type="text" icon={<DeleteOutlined />} loading={isDeleting} />
                </Popconfirm>
              )}
            </div>
          </div>

          {isEditing ? (
            <Form form={form} layout="vertical" onFinish={handleUpdate} className="animate-fade-in">
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                  <Select size="large">
                    <Option value="bug">Bug</Option>
                    <Option value="feature_request">Feature Request</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="priority" label="Priority">
                  <Select size="large">
                    <Option value="low">Low</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="high">High</Option>
                    <Option value="critical">Critical</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="assignee_id" label="Assignee">
                  <Select size="large" placeholder="Select assignee" loading={isUsersLoading} allowClear>
                    {users.map((u: any) => (
                      <Option key={u.id} value={u.id}>
                        👤 {u.name} ({u.role})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <TextArea rows={8} placeholder="Markdown is supported" />
              </Form.Item>
              <div className="flex gap-2 justify-end mt-4">
                <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isUpdating}>Save Changes</Button>
              </div>
            </Form>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">{issue.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <TypeTag type={issue.type} />
                  <StatusTag status={issue.status} />
                  {issue.priority && (
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full uppercase border",
                      issue.priority === 'critical' ? 'bg-red-50 text-red-600 border-red-200' : 
                      issue.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      issue.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-gray-50 text-gray-600 border-gray-200'
                    )}>
                      {issue.priority}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm ml-2 flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {new Date(issue.createdAt || issue.created_at || '').toLocaleString()}
                  </span>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {issue.description}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </Card>

        <Card variant="borderless" className="shadow-sm border border-gray-100">
          <Tabs defaultActiveKey="comments">
            <TabPane 
              tab={<span className="flex items-center gap-2"><CommentOutlined /> Comments</span>} 
              key="comments"
            >
              <List
                loading={isCommentsLoading}
                dataSource={comments || []}
                renderItem={(comment: any) => (
                  <List.Item className="border-b border-gray-50 last:border-0 py-4">
                    <List.Item.Meta
                      avatar={<Avatar src={comment.user_avatar} icon={!comment.user_avatar && <UserOutlined />} />}
                      title={
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">{comment.user_name}</span>
                          <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                      }
                      description={
                        <div className="mt-2 text-gray-700 prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No comments yet' }}
              />

              <div className="mt-6">
                <TextArea 
                  rows={4} 
                  placeholder="Leave a comment... (Markdown supported)" 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="mb-3"
                />
                <div className="flex justify-end">
                  <Button type="primary" onClick={handleAddComment} loading={isAddingComment} disabled={!commentText.trim()}>
                    Comment
                  </Button>
                </div>
              </div>
            </TabPane>
            
            <TabPane 
              tab={<span className="flex items-center gap-2"><PaperClipOutlined /> Attachments</span>} 
              key="attachments"
            >
              <div className="mb-6">
                <input
                  type="file"
                  id="attachment-file-input"
                  className="hidden"
                  onChange={handleUploadAttachment}
                />
                <label htmlFor="attachment-file-input">
                  <Button 
                    type="dashed" 
                    icon={<UploadOutlined />} 
                    loading={isUploadingAttachment} 
                    onClick={() => document.getElementById('attachment-file-input')?.click()}
                    className="w-full h-20 flex flex-col justify-center items-center gap-1 border-dashed hover:border-primary border-2 rounded-lg"
                  >
                    <span>Click to upload files (Images, PDFs, Docs up to 10MB)</span>
                  </Button>
                </label>
              </div>

              <List
                loading={isAttachmentsLoading}
                dataSource={attachments || []}
                renderItem={(attachment: any) => (
                  <List.Item 
                    className="hover:bg-gray-50/50 p-3 rounded-lg border-b border-gray-50 last:border-0 transition-colors"
                    actions={[
                      (isMaintainer || attachment.uploaded_by === user?.id) && (
                        <Popconfirm
                          title="Delete attachment?"
                          onConfirm={() => handleDeleteAttachment(attachment.id)}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button danger type="text" icon={<DeleteOutlined />} loading={isDeletingAttachment} />
                        </Popconfirm>
                      )
                    ].filter(Boolean)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          shape="square" 
                          icon={<PaperClipOutlined />} 
                          className="bg-indigo-50 text-indigo-600"
                          src={attachment.mime_type.startsWith('image/') ? attachment.url : undefined} 
                        />
                      }
                      title={
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-primary transition-colors">
                          {attachment.filename}
                        </a>
                      }
                      description={
                        <span className="text-xs text-gray-400">
                          {(attachment.size / 1024).toFixed(1)} KB • Uploaded by {attachment.uploader_name} on {new Date(attachment.created_at).toLocaleDateString()}
                        </span>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: 'No attachments uploaded yet' }}
              />
            </TabPane>

            <TabPane 
              tab={<span className="flex items-center gap-2"><HistoryOutlined /> History</span>} 
              key="history"
            >
              <List
                loading={isHistoryLoading}
                dataSource={history || []}
                renderItem={(item: any) => (
                  <List.Item className="py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-start gap-3 w-full">
                      <Avatar size="small" src={item.user_avatar} icon={!item.user_avatar && <UserOutlined />} />
                      <div className="flex-1">
                        <p className="m-0 text-sm">
                          <span className="font-semibold">{item.user_name}</span> changed <span className="font-semibold">{item.field_name}</span> from <span className="line-through text-gray-400">{item.old_value || 'none'}</span> to <span className="text-primary font-medium">{item.new_value}</span>
                        </p>
                        <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </List.Item>
                )}
                locale={{ emptyText: 'No history available' }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <Card variant="borderless" className="shadow-sm border border-gray-100" title="Details">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Assignee</p>
              <div className="flex items-center gap-2">
                <Badge dot status={isAssigneeOnline ? 'success' : 'default'} offset={[0, 20]}>
                  <Avatar size="small" src={issue.assignee_avatar} icon={!issue.assignee_avatar && <UserOutlined />} />
                </Badge>
                <span className="text-sm font-medium">{issue.assignee_name || 'Unassigned'}</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reporter</p>
              <div className="flex items-center gap-2">
                <Badge dot status={isReporterOnline ? 'success' : 'default'} offset={[0, 20]}>
                  <Avatar size="small" src={issue.reporter_avatar || issue.reporter?.avatar_url} icon={!(issue.reporter_avatar || issue.reporter?.avatar_url) && <UserOutlined />} />
                </Badge>
                <span className="text-sm font-medium">{issue.reporter_name || issue.reporter?.name || 'Unknown'}</span>
              </div>
            </div>
            
            {(isMaintainer || canEdit) && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Update Status</p>
                <Select
                  value={issue.status}
                  onChange={handleStatusChange}
                  loading={isStatusUpdating}
                  className="w-full"
                >
                  <Option value="open">Open</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="resolved">Resolved</Option>
                </Select>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
