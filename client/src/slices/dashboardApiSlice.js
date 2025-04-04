import { apiSlice } from "@slices/apiSlice";
import { DASHBOARD_URL } from "../constants";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAggregatedGraphData: builder.query({
      query: ({ year }) => ({
        url: `${DASHBOARD_URL}/graph`,
        method: 'GET',
        params: { year },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Dashboard'],
    }),

    getAggregatedGstSales: builder.query({
      query: ({ year }) => ({
        url: `${DASHBOARD_URL}/gstSales`,
        method: 'GET',
        params: { year },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Dashboard'],
    }),

    getAggregatedGstPurchase: builder.query({
      query: ({ year }) => ({
        url: `${DASHBOARD_URL}/gstPurchase`,
        method: 'GET',
        params: { year },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Dashboard'],
    }),

    getAggregatedGstSalesGstPurchase: builder.query({
      query: ({ year }) => ({
        url: `${DASHBOARD_URL}/gstsales-gstpurchase`,
        method: 'GET',
        params: { year },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Dashboard'],
    }),

    getAggregatedSales: builder.query({
      query: ({ year }) => ({
        url: `${DASHBOARD_URL}/sales`,
        method: 'GET',
        params: { year },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Dashboard'],
    }),



  })
})

export const {
  useGetAggregatedGraphDataQuery,
  useGetAggregatedGstSalesQuery,
  useGetAggregatedGstPurchaseQuery,
  useGetAggregatedGstSalesGstPurchaseQuery,
  useGetAggregatedSalesQuery
} = dashboardApiSlice