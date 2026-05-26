import { api } from '../../../redux/api/api';
import { AuthResponse, User } from '../../../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, Record<string, string>>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    signup: builder.mutation<AuthResponse, Record<string, string>>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ['User'],
    }),
    changePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useGetMeQuery, useChangePasswordMutation } = authApi;
