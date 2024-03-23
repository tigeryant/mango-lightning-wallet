import { apiSlice } from '../api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getInfo: builder.query<{ alias: string; balance: number }, void>({
      query: () => "/info",
      providesTags: ["balance"],
    }),
    // type this later - you can find the type with typeof keyof
    getNodeInfo: builder.query<{ node: any }, { pubKey: string }>({
      query: (args) => {
        const { pubKey } = args;
        return {
          url: "/get-node-info",
          params: { pubKey },
        };
      },
    }),
  })
})

export const { useGetInfoQuery, useGetNodeInfoQuery } = extendedApiSlice

export const selectInfoResult = extendedApiSlice.endpoints.getInfo.select()
