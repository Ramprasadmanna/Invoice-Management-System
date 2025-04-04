import { apiSlice } from '@slices/apiSlice';
import { EXPENSE_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addExpense: builder.mutation({
      query: (data) => ({
        url: EXPENSE_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),

    getExpense: builder.query({
      query: ({ keyword, pageNumber, pageSize, fromDate, toDate }) => ({
        url: EXPENSE_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize, fromDate, toDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Expense'],
    }),

    updateExpense: builder.mutation({
      query: (data) => ({
        url: `${EXPENSE_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Expense'],
    }),

    deleteExpense: builder.mutation({
      query: ({ id }) => ({
        url: `${EXPENSE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense'],
    }),

    downloadExpenseExcel: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${EXPENSE_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    expenseItemsSummary: builder.query({
      query: ({ year, itemId }) => ({
        url: `${EXPENSE_URL}/summary/item`,
        method: 'GET',
        params: { year, itemId },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Expense'],
    }),

    downloadExpenseItemsSummaryExcel: builder.mutation({
      query: ({ year, itemId }) => ({
        url: `${EXPENSE_URL}/download/summary/item`,
        method: 'POST',
        cache: 'no-cache',
        params: { itemId, year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),
  }),
});

export const {
  useAddExpenseMutation,
  useGetExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useDownloadExpenseExcelMutation,
  useExpenseItemsSummaryQuery,
  useDownloadExpenseItemsSummaryExcelMutation,
} = itemApiSlice;
