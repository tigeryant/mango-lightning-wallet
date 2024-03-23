import { apiSlice } from '../api/apiSlice'

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    connect: builder.mutation<
      { token: string },
      { host: string; cert: string; macaroon: string }
    >({
      query: (data) => ({
        url: "/connect",
        method: "POST",
        body: data,
      }),
    }),
  })
})

export const { useConnectMutation } = extendedApiSlice

// export const selectConnectResult = extendedApiSlice.endpoints.connect.select()
