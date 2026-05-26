import { User } from './user';

export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type IssueType = 'bug' | 'feature_request';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  _id?: string;
  id: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority?: IssuePriority;
  is_archived?: boolean;
  reporterId?: string;
  reporter_id?: number;
  reporter?: User;
  reporter_name?: string;
  reporter_avatar?: string;
  assignee_id?: number;
  assignee_name?: string;
  assignee_avatar?: string;
  project_id?: number;
  project_name?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface GetIssuesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: IssueStatus;
  type?: IssueType;
  priority?: IssuePriority;
  assignee_id?: number;
  project_id?: number;
  sort?: 'newest' | 'oldest';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

