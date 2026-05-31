import React from 'react';
import { Card, Col, Row, Skeleton, Tag, Avatar, List, Badge } from 'antd';
import {
  BugOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined,
  ThunderboltOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useGetIssuesQuery } from '../../issues/api/issueApi';
import { useAppSelector } from '../../../app/hooks';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  AreaChart, Area,
  ResponsiveContainer,
  Legend
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  open: '#ef4444',
  in_progress: '#3b82f6',
  resolved: '#10b981',
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#94a3b8',
};

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: response, isLoading } = useGetIssuesQuery({ limit: 500 });

  const issues = Array.isArray(response) ? response : response?.data || [];

  const openIssues = issues.filter((i: any) => i.status === 'open').length;
  const inProgressIssues = issues.filter((i: any) => i.status === 'in_progress').length;
  const resolvedIssues = issues.filter((i: any) => i.status === 'resolved').length;
  const bugs = issues.filter((i: any) => i.type === 'bug').length;
  const features = issues.filter((i: any) => i.type === 'feature_request').length;
  const criticalCount = issues.filter((i: any) => i.priority === 'critical' || i.priority === 'high').length;

  // --- Chart Data ---
  const statusData = [
    { name: 'Open', value: openIssues, color: STATUS_COLORS.open },
    { name: 'In Progress', value: inProgressIssues, color: STATUS_COLORS.in_progress },
    { name: 'Resolved', value: resolvedIssues, color: STATUS_COLORS.resolved },
  ];

  const typeData = [
    { name: 'Bugs', count: bugs, fill: '#ef4444' },
    { name: 'Features', count: features, fill: '#8b5cf6' },
  ];

  const priorityData = [
    { name: 'Critical', count: issues.filter((i: any) => i.priority === 'critical').length, fill: PRIORITY_COLORS.critical },
    { name: 'High', count: issues.filter((i: any) => i.priority === 'high').length, fill: PRIORITY_COLORS.high },
    { name: 'Medium', count: issues.filter((i: any) => i.priority === 'medium').length, fill: PRIORITY_COLORS.medium },
    { name: 'Low', count: issues.filter((i: any) => i.priority === 'low').length, fill: PRIORITY_COLORS.low },
  ];

  // Trend: group by day (last 14 days)
  const trendData = (() => {
    const days: Record<string, { opened: number; resolved: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10); // MM-DD
      days[key] = { opened: 0, resolved: 0 };
    }
    issues.forEach((issue: any) => {
      const created = new Date(issue.created_at || issue.createdAt || '');
      const key = created.toISOString().slice(5, 10);
      if (days[key]) days[key].opened++;
      if (issue.status === 'resolved') {
        const updated = new Date(issue.updated_at || issue.updatedAt || '');
        const uKey = updated.toISOString().slice(5, 10);
        if (days[uKey]) days[uKey].resolved++;
      }
    });
    return Object.entries(days).map(([date, val]) => ({ date, ...val }));
  })();

  const recentIssues = [...issues]
    .sort((a: any, b: any) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime())
    .slice(0, 6);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col key={i} xs={24} sm={12} lg={6}>
              <Card><Skeleton active paragraph={{ rows: 1 }} /></Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]}>
          {[1, 2].map(i => (
            <Col key={i} xs={24} lg={12}>
              <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight m-0">
          Welcome back, <span className="text-[var(--color-primary)]">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1 mb-0">Here's your project pulse for today.</p>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden" variant="borderless">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
                <UnorderedListOutlined />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 m-0 tracking-wider">Total Issues</p>
                <p className="text-2xl font-extrabold m-0 text-gray-900">{issues.length}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden" variant="borderless">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 text-xl">
                <BugOutlined />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 m-0 tracking-wider">Open</p>
                <p className="text-2xl font-extrabold m-0 text-gray-900">{openIssues}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden" variant="borderless">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 text-xl">
                <CheckCircleOutlined />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 m-0 tracking-wider">Resolved</p>
                <p className="text-2xl font-extrabold m-0 text-gray-900">{resolvedIssues}</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden" variant="borderless">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-xl">
                <ThunderboltOutlined />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 m-0 tracking-wider">Critical / High</p>
                <p className="text-2xl font-extrabold m-0 text-gray-900">{criticalCount}</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        {/* Status Donut */}
        <Col xs={24} lg={8}>
          <Card title="Issue Status" className="shadow-sm border border-gray-100 rounded-xl" variant="borderless">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: string) => <span className="text-xs font-medium text-gray-600">{value}</span>}
                />
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Priority Bar */}
        <Col xs={24} lg={8}>
          <Card title="By Priority" className="shadow-sm border border-gray-100 rounded-xl" variant="borderless">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Trend Area */}
        <Col xs={24} lg={8}>
          <Card title="14-Day Trend" className="shadow-sm border border-gray-100 rounded-xl" variant="borderless">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Area type="monotone" dataKey="opened" stroke="#ef4444" fill="url(#openGrad)" strokeWidth={2} name="Opened" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolvedGrad)" strokeWidth={2} name="Resolved" />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: string) => <span className="text-xs font-medium text-gray-600">{value}</span>}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity + Type Breakdown */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Issues" className="shadow-sm border border-gray-100 rounded-xl" variant="borderless">
            <List
              dataSource={recentIssues}
              renderItem={(issue: any) => (
                <List.Item className="py-3 border-b border-gray-50 last:border-0" key={issue.id}>
                  <div className="flex items-center gap-3 w-full">
                    <Avatar
                      size="small"
                      src={issue.reporter_avatar || issue.assignee_avatar}
                      icon={<UserOutlined />}
                      className="bg-indigo-100 text-indigo-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 m-0 truncate">{issue.title}</p>
                      <p className="text-xs text-gray-400 m-0 mt-0.5">
                        {issue.reporter_name || issue.reporter?.name || 'Unknown'} · {new Date(issue.created_at || issue.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {issue.priority && (
                        <Tag
                          color={issue.priority === 'critical' ? 'red' : issue.priority === 'high' ? 'orange' : issue.priority === 'medium' ? 'blue' : 'default'}
                          className="m-0 border-none font-semibold text-[10px] px-1.5"
                        >
                          {issue.priority?.toUpperCase()}
                        </Tag>
                      )}
                      <Badge
                        status={issue.status === 'resolved' ? 'success' : issue.status === 'in_progress' ? 'processing' : 'error'}
                        text={<span className="text-xs capitalize">{issue.status?.replace('_', ' ')}</span>}
                      />
                    </div>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: 'No issues yet' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Issue Types" className="shadow-sm border border-gray-100 rounded-xl" variant="borderless">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  stroke="none"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

