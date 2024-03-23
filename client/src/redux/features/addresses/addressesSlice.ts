import { apiSlice } from '../api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    newAddress: builder.query<{ address: string }, void>({
      query: () => "/addresses/new",
    }),
  })
})

export const { useNewAddressQuery } = extendedApiSlice

export const selectAddressResult = extendedApiSlice.endpoints.newAddress.select()
