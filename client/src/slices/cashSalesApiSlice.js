import { apiSlice } from '@slices/apiSlice';
import { CASH_SALES_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCashSale: builder.mutation({
      query: (data) => ({
        url: `${CASH_SALES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CashSales'],
    }),

    updateCashSale: builder.mutation({
      query: (data) => ({
        url: `${CASH_SALES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CashSales'],
    }),

    getCashSales: builder.query({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: CASH_SALES_URL,
        method: 'GET',
        params: {
          keyword,
          pageNumber,
          pageSize,
          accountType,
          fromDate,
          toDate,
          balanceDue,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['CashSales'],
    }),

    deleteCashSale: builder.mutation({
      query: ({ id }) => ({
        url: `${CASH_SALES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CashSales'],
    }),

    previewCashSaleInvoice: builder.query({
      query: ({ id }) => ({
        url: `${CASH_SALES_URL}/invoice/preview/${id}`,
        method: 'GET',
        cache: 'no-cache',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    sendSaleInvoiceMail: builder.query({
      query: ({ id }) => ({
        url: `${CASH_SALES_URL}/invoice/sendMail/${id}`,
        method: 'GET',
        cache: 'no-cache',
      }),
    }),

    downloadCashSaleInvoice: builder.query({
      query: ({ id }) => ({
        url: `${CASH_SALES_URL}/invoice/download/${id}`,
        method: 'GET',
        cache: 'no-cache',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadCashSalesPdf: builder.mutation({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: `${CASH_SALES_URL}/download/pdf`,
        method: 'POST',
        params: {
          keyword,
          pageNumber,
          pageSize,
          accountType,
          fromDate,
          toDate,
          balanceDue,
        },
        cache: 'no-cache',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadCashSalesExcel: builder.mutation({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: `${CASH_SALES_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: {
          keyword,
          pageNumber,
          pageSize,
          accountType,
          fromDate,
          toDate,
          balanceDue,
        },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    getSalesSummary: builder.query({
      query: ({ year, keyword }) => ({
        url: `${CASH_SALES_URL}/summary/customers`,
        method: 'GET',
        params: { year, keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['CashSales'],
    }),

    downloadSalesSummaryExcel: builder.mutation({
      query: ({ year, keyword }) => ({
        url: `${CASH_SALES_URL}/download/summary/customers`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    getSalesProductSummary: builder.query({
      query: ({ year, productId }) => ({
        url: `${CASH_SALES_URL}/summary/product`,
        method: 'GET',
        params: { year, productId },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['CashSales'],
    }),

    downloadSalesProductSummaryExcel: builder.mutation({
      query: ({ year, keyword }) => ({
        url: `${CASH_SALES_URL}/download/summary/product`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),
  }),
});

export const {
  useCreateCashSaleMutation,
  useUpdateCashSaleMutation,
  useGetCashSalesQuery,
  useDeleteCashSaleMutation,
  useLazyPreviewCashSaleInvoiceQuery,
  useLazySendSaleInvoiceMailQuery,
  useLazyDownloadCashSaleInvoiceQuery,
  useDownloadCashSalesPdfMutation,
  useDownloadCashSalesExcelMutation,
  useGetSalesSummaryQuery,
  useDownloadSalesSummaryExcelMutation,
  useGetSalesProductSummaryQuery,
  useDownloadSalesProductSummaryExcelMutation,
} = itemApiSlice;
