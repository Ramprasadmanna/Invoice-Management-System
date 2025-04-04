import { apiSlice } from '@slices/apiSlice';
import { GST_SALES_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGstSale: builder.mutation({
      query: (data) => ({
        url: `${GST_SALES_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GstSales'],
    }),

    updateGstSale: builder.mutation({
      query: (data) => ({
        url: `${GST_SALES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GstSales'],
    }),

    getGstSales: builder.query({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        invoiceType,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: GST_SALES_URL,
        method: 'GET',
        params: {
          keyword,
          pageNumber,
          pageSize,
          invoiceType,
          accountType,
          fromDate,
          toDate,
          balanceDue,
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstSales'],
    }),

    deleteGstSale: builder.mutation({
      query: ({ id }) => ({
        url: `${GST_SALES_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GstSales'],
    }),

    previewGstSaleInvoice: builder.query({
      query: ({ id }) => ({
        url: `${GST_SALES_URL}/invoice/preview/${id}`,
        method: 'GET',
        cache: 'no-cache',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    sendGstSaleInvoiceMail: builder.query({
      query: ({ id }) => ({
        url: `${GST_SALES_URL}/invoice/sendMail/${id}`,
        method: 'GET',
        cache: 'no-cache',
      }),
    }),

    downloadGstSaleInvoice: builder.query({
      query: ({ id }) => ({
        url: `${GST_SALES_URL}/invoice/download/${id}`,
        method: 'GET',
        cache: 'no-cache',
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadGstSalesPdf: builder.mutation({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        invoiceType,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: `${GST_SALES_URL}/download/pdf`,
        method: 'POST',
        params: {
          keyword,
          pageNumber,
          pageSize,
          invoiceType,
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

    downloadGstSalesExcel: builder.mutation({
      query: ({
        keyword,
        pageNumber,
        pageSize,
        invoiceType,
        accountType,
        fromDate,
        toDate,
        balanceDue,
      }) => ({
        url: `${GST_SALES_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: {
          keyword,
          pageNumber,
          pageSize,
          invoiceType,
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

    getGstSalesSummary: builder.query({
      query: ({ year, keyword }) => ({
        url: `${GST_SALES_URL}/summary/customers`,
        method: 'GET',
        params: { year, keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstSales'],
    }),

    downloadGstSalesSummaryExcel: builder.mutation({
      query: ({ year, keyword }) => ({
        url: `${GST_SALES_URL}/download/summary/customers`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    getGstSalesHsnSummary: builder.query({
      query: ({ year, hsnSac }) => ({
        url: `${GST_SALES_URL}/summary/hsn`,
        method: 'GET',
        params: { year, hsnSac },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstSales'],
    }),

    downloadGstSalesHsnSummaryExcel: builder.mutation({
      query: ({ hsnSac, year }) => ({
        url: `${GST_SALES_URL}/download/summary/hsn`,
        method: 'POST',
        cache: 'no-cache',
        params: { hsnSac, year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    getGstSalesProductSummary: builder.query({
      query: ({ year, productId }) => ({
        url: `${GST_SALES_URL}/summary/product`,
        method: 'GET',
        params: { year, productId },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstSales'],
    }),

    downloadGstSalesProductSummaryExcel: builder.mutation({
      query: ({ year, productId }) => ({
        url: `${GST_SALES_URL}/download/summary/product`,
        method: 'POST',
        cache: 'no-cache',
        params: { year, productId },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),
  }),
});

export const {
  useCreateGstSaleMutation,
  useUpdateGstSaleMutation,
  useGetGstSalesQuery,
  useDeleteGstSaleMutation,
  useLazyPreviewGstSaleInvoiceQuery,
  useLazySendGstSaleInvoiceMailQuery,
  useLazyDownloadGstSaleInvoiceQuery,
  useDownloadGstSalesPdfMutation,
  useDownloadGstSalesExcelMutation,
  useGetGstSalesSummaryQuery,
  useDownloadGstSalesSummaryExcelMutation,
  useGetGstSalesHsnSummaryQuery,
  useDownloadGstSalesHsnSummaryExcelMutation,
  useGetGstSalesProductSummaryQuery,
  useDownloadGstSalesProductSummaryExcelMutation,
} = itemApiSlice;
