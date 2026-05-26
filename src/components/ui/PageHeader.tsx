import React from 'react';
import { Button, Space, Breadcrumb } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBack?: boolean;
  backPath?: string;
  extra?: React.ReactNode;
}

/**
 * Reusable page header with breadcrumbs, title, subtitle, back button, and action area.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  showBack = false,
  backPath,
  extra,
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '24px' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ marginBottom: '8px' }}
          items={breadcrumbs.map((item) => ({
            title: item.path ? (
              <a onClick={() => navigate(item.path!)} style={{ color: '#6366f1', cursor: 'pointer' }}>
                {item.label}
              </a>
            ) : (
              <span style={{ color: '#94a3b8' }}>{item.label}</span>
            ),
          }))}
        />
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => backPath ? navigate(backPath) : navigate(-1)}
              style={{ color: '#94a3b8', padding: '4px 8px' }}
            />
          )}
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#f1f5f9',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '4px 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {extra && <Space>{extra}</Space>}
      </div>
    </div>
  );
};
