import { apiSlice } from '@slices/apiSlice';
import { EXPENSE_ITEM_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addExpenseItem: builder.mutation({
      query: (data) => ({
        url: EXPENSE_ITEM_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ExpenseItems'],
    }),

    getExpenseItems: builder.query({
      query: ({ keyword, pageNumber, pageSize, fromDate, toDate }) => ({
        url: EXPENSE_ITEM_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize, fromDate, toDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['ExpenseItems'],
    }),

    searchExpenseItem: builder.query({
      query: ({ keyword }) => ({
        url: `${EXPENSE_ITEM_URL}/search`,
        method: 'GET',
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
    }),

    updateExpenseItem: builder.mutation({
      query: (data) => ({
        url: `${EXPENSE_ITEM_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ExpenseItems'],
    }),

    deleteExpenseItem: builder.mutation({
      query: ({ id }) => ({
        url: `${EXPENSE_ITEM_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExpenseItems'],
    }),

    downloadExpenseItemsExcel: builder.mutation({
      query: ({ pageSize, pageNumber, keyword }) => ({
        url: `${EXPENSE_ITEM_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: { pageSize, pageNumber, keyword },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),
  }),
});

export const {
  useAddExpenseItemMutation,
  useGetExpenseItemsQuery,
  useLazySearchExpenseItemQuery,
  useUpdateExpenseItemMutation,
  useDeleteExpenseItemMutation,
  useDownloadExpenseItemsExcelMutation,
} = itemApiSlice;
