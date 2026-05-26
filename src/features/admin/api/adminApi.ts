import { api } from '../../../redux/api/api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUserRole: builder.mutation<any, { id: string; role: 'contributor' | 'maintainer' }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    toggleAccountLock: builder.mutation<any, { id: string; lock: boolean }>({
      query: ({ id, lock }) => ({
        url: `/admin/users/${id}/lock`,
        method: 'PATCH',
        body: { lock },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getSystemLogs: builder.query<{ data: any[]; meta?: any }, any | void>({
      query: (params) => {
        let url = '/admin/logs';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
      providesTags: ['Dashboard'], // Reuse dashboard or setup new tags
    }),
  }),
});

export const {
  useUpdateUserRoleMutation,
  useToggleAccountLockMutation,
  useDeleteUserMutation,
  useGetSystemLogsQuery,
} = adminApi;
