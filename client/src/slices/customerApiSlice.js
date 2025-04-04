import { apiSlice } from '@slices/apiSlice';
import { CUSTOMER_URL } from '../constants';

const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      query: (data) => ({
        url: CUSTOMER_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    getCustomers: builder.query({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: CUSTOMER_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Customer'],
    }),

    searchCustomers: builder.query({
      query: ({ keyword }) => ({
        url: `${CUSTOMER_URL}/search`,
        method: 'GET',
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
    }),

    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Customer'],
    }),

    deleteCustomer: builder.mutation({
      query: ({ id }) => ({
        url: `${CUSTOMER_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    downloadCustomerPdf: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${CUSTOMER_URL}/download/pdf`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadCustomerExcel: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${CUSTOMER_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),
  }),
});

export const {
  useAddCustomerMutation,
  useGetCustomersQuery,
  useLazySearchCustomersQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useDownloadCustomerPdfMutation,
  useDownloadCustomerExcelMutation,
} = customerApiSlice;
