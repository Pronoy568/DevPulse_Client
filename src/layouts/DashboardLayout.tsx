import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Badge, MenuProps } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
  ProjectOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/slices/authSlice';
import { cn } from '../utils/cn';
import { NotificationCenter } from '../features/notifications/components/NotificationCenter';
import { useGetNotificationsQuery } from '../features/notifications/api/notificationApi';
import { useTheme } from '../providers/ThemeProvider';


const { Header, Sider, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();


  const { data: notificationsData } = useGetNotificationsQuery(undefined, { skip: !user });
  const unreadNotificationsCount = notificationsData?.data?.filter((n: any) => !n.is_read).length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenu: MenuProps = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'My Profile',
        onClick: () => navigate('/profile'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined className="text-red-500" />,
        label: <span className="text-red-500">Logout</span>,
        onClick: handleLogout,
      },
    ],
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <AppstoreOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/'),
      },
      {
        key: '/projects',
        icon: <ProjectOutlined />,
        label: 'Projects',
        onClick: () => navigate('/projects'),
      },
      {
        key: '/issues',
        icon: <UnorderedListOutlined />,
        label: 'Issues',
        onClick: () => navigate('/issues'),
      },
      {
        key: '/teams',
        icon: <TeamOutlined />,
        label: 'Teams',
        onClick: () => navigate('/teams'),
      },
    ];

    if (user?.role === 'admin' || user?.role === 'maintainer') {
      items.push({
        key: '/admin',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => navigate('/admin'),
      });
    }

    return items;
  };

  return (
    <Layout className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="80"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        width={260}
        theme={theme}
        className="shadow-2xl z-20 border-r border-[var(--border-color)] transition-all duration-300"
      >
        <div className="h-16 flex items-center justify-center font-extrabold text-xl text-[var(--text-primary)] tracking-wider cursor-pointer mt-2 transition-colors duration-300" onClick={() => navigate('/')}>
          {collapsed ? 'DP' : (
            <span className="flex items-center gap-2">
              <span className="text-[var(--primary-color)]">Dev</span>Pulse
            </span>
          )}
        </div>

        <div className="px-4 py-6">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={cn("w-full flex items-center justify-center font-medium transition-all duration-300", collapsed ? "px-0" : "")}
            size="large"
            onClick={() => navigate('/issues/create')}
          >
            {!collapsed && "New Issue"}
          </Button>
        </div>

        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          className="bg-transparent border-none px-3 font-medium transition-all duration-300"
        />
      </Sider>


      <Layout className="bg-[var(--bg-secondary)] transition-all duration-300">
        <Header className="bg-[var(--bg-primary)]/80 backdrop-blur-md px-6 flex justify-between items-center shadow-sm z-10 sticky top-0 border-b border-[var(--border-color)]">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg w-10 h-10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <Button
              type="text"
              icon={theme === 'dark' ? <SunOutlined className="text-amber-400 text-lg transition-transform duration-500 hover:rotate-[30deg]" /> : <MoonOutlined className="text-indigo-600 text-lg transition-transform duration-500 hover:rotate-[-15deg]" />}
              onClick={toggleTheme}
              className="text-lg w-10 h-10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-300 flex items-center justify-center rounded-full"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            />

            <Badge
              count={unreadNotificationsCount}
              size="small"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setNotificationsOpen(true)}
            >
              <BellOutlined className="text-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
            </Badge>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-secondary)] p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-[var(--border-color)]">
                <Avatar
                  src={user?.avatar_url}
                  icon={!user?.avatar_url && <UserOutlined />}
                  className="bg-[var(--primary-color)]"
                />

                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</span>
                  <span className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</span>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 p-0 md:p-6 bg-transparent rounded-xl flex flex-col h-full overflow-x-hidden">
          <Outlet />
        </Content>
        <NotificationCenter open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      </Layout>
    </Layout>
  );
};
