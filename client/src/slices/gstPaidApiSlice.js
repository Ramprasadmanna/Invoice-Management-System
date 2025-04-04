import { apiSlice } from "@slices/apiSlice";
import { GST_PAID_URL } from "../constants";

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addGstPaid: builder.mutation({
      query: (data) => ({
        url: GST_PAID_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GstPaid']
    }),

    getGstPaid: builder.query({
      query: ({ year }) => ({
        url: GST_PAID_URL,
        method: 'GET',
        params: { year }
      }),
      keepUnusedDataFor: 5,
      providesTags: ['GstPaid'],
    }),

    updateGstPaid: builder.mutation({
      query: (data) => ({
        url: `${GST_PAID_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GstPaid']
    }),

    deleteGstPaid: builder.mutation({
      query: (data) => ({
        url: `${GST_PAID_URL}/${data.id}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['GstPaid']
    }),

    downloadGstPaidExcel: builder.mutation({
      query: ({ year }) => ({
        url: `${GST_PAID_URL}/download/excel`,
        method: 'POST',
        cache: 'no-cache',
        params: { year },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: (response) => {
        return URL.createObjectURL(response);
      },
    }),



  }),
});

export const {
  useAddGstPaidMutation,
  useGetGstPaidQuery,
  useUpdateGstPaidMutation,
  useDeleteGstPaidMutation,
  useDownloadGstPaidExcelMutation
} = itemApiSlice;