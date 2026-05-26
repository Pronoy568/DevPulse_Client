import React from 'react';
import { Card, Skeleton, Space } from 'antd';

/**
 * Skeleton loading card for dashboard stats.
 */
export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`, gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={{ borderColor: '#334155' }}>
          <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
        </Card>
      ))}
    </div>
  );
};

/**
 * Skeleton loading for a table/list.
 */
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} active paragraph={{ rows: 0 }} title={{ width: `${60 + Math.random() * 30}%` }} />
      ))}
    </Space>
  );
};

/**
 * Skeleton for issue detail page.
 */
export const SkeletonDetail: React.FC = () => {
  return (
    <Card style={{ borderColor: '#334155' }}>
      <Skeleton active paragraph={{ rows: 8 }} title={{ width: '40%' }} />
    </Card>
  );
};
