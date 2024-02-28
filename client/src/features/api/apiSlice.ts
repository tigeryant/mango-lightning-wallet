import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL!}`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("X-Token", `${(getState() as RootState).auth.token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    connect: builder.mutation< { token: string }, { host: string; cert: string; macaroon: string } >({
      query: (data) => ({
        url: "/connect",
        method: "POST",
        body: data,
      }),
    }),
    getInfo: builder.query<{ alias: string; balance: number }, void>({
      query: () => "/info",
    }),
  }),
});

export const { useConnectMutation, useGetInfoQuery } = apiSlice;
