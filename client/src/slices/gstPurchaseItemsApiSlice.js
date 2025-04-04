import { apiSlice } from '@slices/apiSlice';
import { GST_PURCHASEITEM_URL } from '../constants';

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addGstPurchaseItem: builder.mutation({
      query: (data) => ({
        url: GST_PURCHASEITEM_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GstPurchaseItems'],
    }),

    getGstPurchaseItems: builder.query({
      query: ({ keyword, pageNumber, pageSize, fromDate, toDate }) => ({
        url: GST_PURCHASEITEM_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize, fromDate, toDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstPurchaseItems'],
    }),

    searchGstPurchaseItem: builder.query({
      query: ({ keyword }) => ({
        url: `${GST_PURCHASEITEM_URL}/search`,
        method: 'GET',
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
    }),

    updateGstPurchaseItem: builder.mutation({
      query: (data) => ({
        url: `${GST_PURCHASEITEM_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GstPurchaseItems'],
    }),

    deleteGstPurchaseItem: builder.mutation({
      query: ({ id }) => ({
        url: `${GST_PURCHASEITEM_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GstPurchaseItems'],
    }),

    downloadGstPurchaseItemsExcel: builder.mutation({
      query: ({ pageSize, pageNumber, keyword }) => ({
        url: `${GST_PURCHASEITEM_URL}/download/excel`,
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
  useAddGstPurchaseItemMutation,
  useGetGstPurchaseItemsQuery,
  useLazySearchGstPurchaseItemQuery,
  useUpdateGstPurchaseItemMutation,
  useDeleteGstPurchaseItemMutation,
  useDownloadGstPurchaseItemsExcelMutation,
} = itemApiSlice;
