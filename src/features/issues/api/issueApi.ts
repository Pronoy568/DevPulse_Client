import { api } from '../../../redux/api/api';
import { Issue, GetIssuesParams, IssueStatus } from '../../../types';

export const issueApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<any, GetIssuesParams | void>({
      query: (params) => {
        let url = '/issues';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.search) queryParams.append('search', params.search);
          if (params.status) queryParams.append('status', params.status);
          if (params.type) queryParams.append('type', params.type);
          if (params.sort) queryParams.append('sort', params.sort);
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
      transformResponse: (response: { data: Issue[], meta: any }) => response,
      providesTags: ['Issue'],
    }),
    getIssueById: builder.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      transformResponse: (response: { data: Issue }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
    }),
    createIssue: builder.mutation<Issue, Partial<Issue>>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Issue }) => response.data,
      invalidatesTags: ['Issue'],
    }),
    updateIssue: builder.mutation<Issue, { id: string; body: Partial<Issue> }>({
      query: ({ id, body }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: Issue }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Issue', id }, 'Issue', 'IssueHistory'],
    }),
    updateIssueStatus: builder.mutation<Issue, { id: string; status: IssueStatus }>({
      query: ({ id, status }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (response: { data: Issue }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Issue', id }, 'Issue', 'IssueHistory'],
    }),
    deleteIssue: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: { data: { success: boolean; id: string } }) => response.data,
      invalidatesTags: ['Issue'],
    }),

    // Comments
    getIssueComments: builder.query<any[], string>({
      query: (id) => `/issues/${id}/comments`,
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'IssueComment', id }],
    }),
    addIssueComment: builder.mutation<any, { issueId: string; content: string }>({
      query: ({ issueId, content }) => ({
        url: `/issues/${issueId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'IssueComment', id: issueId }],
    }),

    // History
    getIssueHistory: builder.query<any[], string>({
      query: (id) => `/issues/${id}/history`,
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'IssueHistory', id }],
    }),

    // Attachments
    getIssueAttachments: builder.query<any[], string>({
      query: (id) => `/issues/${id}/attachments`,
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'IssueAttachment', id }],
    }),
    uploadIssueAttachment: builder.mutation<any, { issueId: string; file: File }>({
      query: ({ issueId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/issues/${issueId}/attachments`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'IssueAttachment', id: issueId }],
    }),
    deleteIssueAttachment: builder.mutation<any, { issueId: string; attachmentId: number }>({
      query: ({ issueId, attachmentId }) => ({
        url: `/issues/${issueId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { issueId }) => [{ type: 'IssueAttachment', id: issueId }],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useUpdateIssueStatusMutation,
  useDeleteIssueMutation,
  useGetIssueCommentsQuery,
  useAddIssueCommentMutation,
  useGetIssueHistoryQuery,
  useGetIssueAttachmentsQuery,
  useUploadIssueAttachmentMutation,
  useDeleteIssueAttachmentMutation,
} = issueApi;
