import { apiSlice } from '@slices/apiSlice';
import { CASH_ITEM_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCashItem: builder.mutation({
      query: (data) => ({
        url: CASH_ITEM_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Items'],
    }),

    getCashItems: builder.query({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: CASH_ITEM_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Items'],
    }),

    searchCashItems: builder.query({
      query: ({ keyword }) => ({
        url: `${CASH_ITEM_URL}/search`,
        method: 'GET',
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
    }),

    updateCashItem: builder.mutation({
      query: (data) => ({
        url: `${CASH_ITEM_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Items'],
    }),

    deleteCashItem: builder.mutation({
      query: ({ id }) => ({
        url: `${CASH_ITEM_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),

    downloadCashItemPdf: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${CASH_ITEM_URL}/download/pdf`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadCashItemExcel: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${CASH_ITEM_URL}/download/excel`,
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
  useAddCashItemMutation,
  useGetCashItemsQuery,
  useLazySearchCashItemsQuery,
  useUpdateCashItemMutation,
  useDeleteCashItemMutation,
  useDownloadCashItemPdfMutation,
  useDownloadCashItemExcelMutation,
} = itemApiSlice;
