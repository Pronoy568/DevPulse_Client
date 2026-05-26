import React from 'react';
import { Empty, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Beautiful empty state component for when there's no data to display.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data found',
  description = 'There are no items to display at this time.',
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '64px 24px',
    }}>
      <Empty
        image={icon || <InboxOutlined style={{ fontSize: 64, color: '#475569' }} />}
        imageStyle={{ height: 80 }}
        description={
          <div>
            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: '4px',
            }}>
              {title}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0,
            }}>
              {description}
            </p>
          </div>
        }
      >
        {actionLabel && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  );
};
