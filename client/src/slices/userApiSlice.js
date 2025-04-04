import { apiSlice } from '@slices/apiSlice';
import { USER_URL } from '../constants';

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
      }),
    }),
    update: builder.mutation({
      query: ({ name, email, password, id }) => ({
        url: `${USER_URL}/update/${id}`,
        method: 'POST',
        body: { name, email, password, id },
      }),
      invalidatesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: `${USER_URL}`,
        method: 'POST',
        body: { name, email, password },
      }),
      invalidatesTags: ['User'],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: `${USER_URL}/`,
        method: 'GET',
        cache: 'no-cache',
      }),
      keepUnusedDataFor: 5,
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `${USER_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateMutation,
  useCreateUserMutation,
  useGetAllUserQuery,
  useDeleteUserMutation,
} = userApiSlice;
