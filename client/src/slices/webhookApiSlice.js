import { apiSlice } from '@slices/apiSlice';
import { WEBHOOK_URL } from '../constants';

const webhookApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWebhookGstOrders: builder.query({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        invoiceType,
        accountType,
        fromDate,
        toDate,
      }) => ({
        url: `${WEBHOOK_URL}/gstOrder`,
        method: 'GET',
        params: {
          keyword,
          pageNumber,
          pageSize,
          invoiceType,
          accountType,
          fromDate,
          toDate,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['WebHook'],
    }),

    getWebhookOrders: builder.query({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        invoiceType,
        accountType,
        fromDate,
        toDate,
      }) => ({
        url: `${WEBHOOK_URL}/order`,
        method: 'GET',
        params: {
          keyword,
          pageNumber,
          pageSize,
          invoiceType,
          accountType,
          fromDate,
          toDate,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['WebHook'],
    }),

    confirmGstOrder: builder.mutation({
      query: (data) => ({
        url: `${WEBHOOK_URL}/${data.id}/confirmGstOrder`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WebHook'],
    }),

    confirmOrder: builder.mutation({
      query: (data) => ({
        url: `${WEBHOOK_URL}/${data.id}/confirmOrder`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WebHook'],
    }),
  }),
});

export const {
  useGetWebhookGstOrdersQuery,
  useGetWebhookOrdersQuery,
  useConfirmGstOrderMutation,
  useConfirmOrderMutation,
} = webhookApiSlice;
