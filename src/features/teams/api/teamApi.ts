import { api } from '../../../redux/api/api';

export const teamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<any, void>({
      query: () => '/teams',
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ['Team'],
    }),
    createTeam: builder.mutation<any, { name: string; description?: string }>({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    deleteTeam: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    addTeamMember: builder.mutation<any, { teamId: string | number; userId: number; role?: string }>({
      query: ({ teamId, userId, role }) => ({
        url: `/teams/${teamId}/members`,
        method: 'POST',
        body: { userId, role },
      }),
      invalidatesTags: ['Team'],
    }),
    removeTeamMember: builder.mutation<any, { teamId: string | number; userId: number }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} = teamApi;
