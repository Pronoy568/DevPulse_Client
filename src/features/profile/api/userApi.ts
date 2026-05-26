import { api } from '../../../redux/api/api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: any[]; meta?: any }, any | void>({
      query: (params) => {
        let url = '/users';
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.search) queryParams.append('search', params.search);
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
      providesTags: ['User'],
    }),
    getProfile: builder.query<any, void>({
      query: () => '/users/me',
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
