import { apiSlice } from '@slices/apiSlice';
import { GST_PURCHASE_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addGstPurchase: builder.mutation({
      query: (data) => ({
        url: GST_PURCHASE_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GstPurchase'],
    }),

    getGstPurchase: builder.query({
      query: ({ keyword, pageNumber, pageSize, fromDate, toDate }) => ({
        url: GST_PURCHASE_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize, fromDate, toDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstPurchase'],
    }),

    updateGstPurchase: builder.mutation({
      query: (data) => ({
        url: `${GST_PURCHASE_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GstPurchase'],
    }),

    deleteGstPurchase: builder.mutation({
      query: ({ id }) => ({
        url: `${GST_PURCHASE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GstPurchase'],
    }),

    downloadGstPurchaseExcel: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${GST_PURCHASE_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    getGstPurchaseItemsSummary: builder.query({
      query: ({ year, companyId }) => ({
        url: `${GST_PURCHASE_URL}/summary/company`,
        method: 'GET',
        params: { year, companyId },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstPurchase'],
    }),

    downloadGstPurchaseCompanySummaryExcel: builder.mutation({
      query: ({ year, keyword }) => ({
        url: `${GST_PURCHASE_URL}/download/summary/company`,
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
  useAddGstPurchaseMutation,
  useGetGstPurchaseQuery,
  useUpdateGstPurchaseMutation,
  useDeleteGstPurchaseMutation,
  useDownloadGstPurchaseExcelMutation,
  useGetGstPurchaseItemsSummaryQuery,
  useDownloadGstPurchaseCompanySummaryExcelMutation,
} = itemApiSlice;
