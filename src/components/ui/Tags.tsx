import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { IssueStatus, IssueType } from '../../types';

export const StatusTag: React.FC<{ status: IssueStatus }> = ({ status }) => {
  switch (status) {
    case 'open':
      return <Tag color="error" icon={<InfoCircleOutlined />}>OPEN</Tag>;
    case 'in_progress':
      return <Tag color="processing" icon={<SyncOutlined spin />}>IN PROGRESS</Tag>;
    case 'resolved':
      return <Tag color="success" icon={<CheckCircleOutlined />}>RESOLVED</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export const TypeTag: React.FC<{ type: IssueType }> = ({ type }) => {
  switch (type) {
    case 'bug':
      return <Tag color="red">Bug</Tag>;
    case 'feature_request':
      return <Tag color="purple">Feature</Tag>;
    default:
      return <Tag>{type}</Tag>;
  }
};
