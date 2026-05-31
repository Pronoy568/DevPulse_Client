import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, Tag, Avatar, Tooltip, Skeleton, Input, Button } from 'antd';
import {
  BugOutlined,
  BulbOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetIssuesQuery, useUpdateIssueMutation } from '../api/issueApi';
import { Issue, IssueStatus } from '../../../types';
import { cn } from '../../../utils/cn';

const STATUSES: { id: IssueStatus; title: string; color: string }[] = [
  { id: 'open', title: 'To Do', color: 'bg-gray-100 border-gray-200' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 border-blue-100' },
  { id: 'resolved', title: 'Done', color: 'bg-green-50 border-green-100' },
];

export const IssueBoard: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: response, isLoading } = useGetIssuesQuery({ search, limit: 100 });
  const [updateIssue] = useUpdateIssueMutation();
  const navigate = useNavigate();

  const [columns, setColumns] = useState<Record<string, Issue[]>>({
    open: [],
    in_progress: [],
    resolved: []
  });

  // Since response structure changed, we need to handle both arrays and objects with .data
  const issuesList = Array.isArray(response) ? response : response?.data || [];

  useEffect(() => {
    if (issuesList) {
      const newColumns: Record<string, Issue[]> = {
        open: [],
        in_progress: [],
        resolved: []
      };

      issuesList.forEach((issue: Issue) => {
        if (newColumns[issue.status]) {
          newColumns[issue.status].push(issue);
        }
      });

      setColumns(newColumns);
    }
  }, [issuesList]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStatus = source.droppableId as IssueStatus;
    const destStatus = destination.droppableId as IssueStatus;

    const sourceCol = [...columns[sourceStatus]];
    const destCol = sourceStatus === destStatus ? sourceCol : [...columns[destStatus]];

    const [movedItem] = sourceCol.splice(source.index, 1);

    if (sourceStatus !== destStatus) {
      movedItem.status = destStatus;
    }

    destCol.splice(destination.index, 0, movedItem);

    setColumns({
      ...columns,
      [sourceStatus]: sourceCol,
      [destStatus]: destCol,
    });

    if (sourceStatus !== destStatus) {
      try {
        await updateIssue({ id: draggableId, body: { status: destStatus } }).unwrap();
      } catch (err) {
        // Optimistic UI rollback could go here
      }
    }
  };

  if (isLoading && !issuesList.length) {
    return (
      <div className="flex gap-6 h-[calc(100vh-160px)]">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <Skeleton active title={false} paragraph={{ rows: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">Board</h1>
          <p className="text-gray-500 m-0">Drag and drop issues to update their status</p>
        </div>
        <div>
          <Input
            placeholder="Search issues..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-64"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate('/issues/list')} className="px-0 text-gray-500 ms-2">
            Show List
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 items-start h-[calc(100vh-200px)] overflow-x-auto pb-4">
          {STATUSES.map(col => (
            <div key={col.id} className={cn("flex flex-col min-w-[320px] max-w-[350px] w-full flex-shrink-0 h-full rounded-xl border p-4", col.color)}>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-gray-700 m-0">{col.title}</h3>
                <span className="bg-white/60 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                  {columns[col.id]?.length || 0}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 overflow-y-auto overflow-x-hidden min-h-[150px] rounded-lg transition-colors p-1",
                      snapshot.isDraggingOver ? "bg-black/5" : ""
                    )}
                  >
                    {columns[col.id]?.map((issue, index) => (
                      <Draggable key={issue.id} draggableId={String(issue.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                            className="mb-3"
                          >
                            <Card
                              size="small"
                              bordered={false}
                              onClick={() => navigate(`/issues/${issue.id}`)}
                              className={cn(
                                "shadow-sm border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group",
                                snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : ""
                              )}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">
                                  {issue.type === 'bug' ? <BugOutlined className="text-red-500 mr-1" /> : <BulbOutlined className="text-yellow-500 mr-1" />}
                                  {issue.id}
                                </span>
                                {issue.priority && (
                                  <Tag color={issue.priority === 'critical' ? 'red' : issue.priority === 'high' ? 'orange' : issue.priority === 'low' ? 'blue' : 'default'} className="m-0 border-none px-1.5 py-0 font-semibold text-[10px]">
                                    {issue.priority.toUpperCase()}
                                  </Tag>
                                )}
                              </div>

                              <h4 className="font-semibold text-sm text-gray-800 mb-3 line-clamp-2 leading-tight">
                                {issue.title}
                              </h4>

                              <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center text-xs text-gray-400 font-medium">
                                  <ClockCircleOutlined className="mr-1" />
                                  {new Date(issue.created_at || issue.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex -space-x-2">
                                  {issue.assignee_avatar || issue.reporter?.avatar_url ? (
                                    <Tooltip title={`Assigned to: ${issue.assignee_name || issue.reporter?.name}`}>
                                      <Avatar size="small" src={issue.assignee_avatar || issue.reporter?.avatar_url} className="border-2 border-white shadow-sm" />
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Unassigned">
                                      <Avatar size="small" className="bg-gray-200 border-2 border-white shadow-sm" />
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
