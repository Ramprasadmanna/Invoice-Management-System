import { apiSlice } from "@slices/apiSlice";
import { GST_ITEM_URL } from "../constants";

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addGstItem: builder.mutation({
      query: (data) => ({
        url: GST_ITEM_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GstItems']
    }),

    getGstItems: builder.query({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: GST_ITEM_URL,
        method: 'GET',
        params: { keyword, pageNumber, pageSize }
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstItems'],
    }),

    searchGstItems: builder.query({
      query: ({ keyword }) => ({
        url: `${GST_ITEM_URL}/search`,
        method: 'GET',
        params: { keyword }
      }),
      keepUnusedDataFor: 5,
    }),

    updateGstItem: builder.mutation({
      query: (data) => ({
        url: `${GST_ITEM_URL}/${data.id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['GstItems'],
    }),

    deleteGstItem: builder.mutation({
      query: ({ id }) => ({
        url: `${GST_ITEM_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GstItems'],
    }),

    downloadGstItemPdf: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${GST_ITEM_URL}/download/pdf`,
        method: 'POST',
        cache: 'no-cache',
        params: { keyword, pageNumber, pageSize },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),

    downloadGstItemExcel: builder.mutation({
      query: ({ keyword, pageNumber, pageSize }) => ({
        url: `${GST_ITEM_URL}/download/excel`,
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
  useAddGstItemMutation,
  useGetGstItemsQuery,
  useLazySearchGstItemsQuery,
  useUpdateGstItemMutation,
  useDeleteGstItemMutation,
  useDownloadGstItemPdfMutation,
  useDownloadGstItemExcelMutation
} = itemApiSlice;