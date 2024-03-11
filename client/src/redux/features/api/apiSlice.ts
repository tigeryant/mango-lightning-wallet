import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
const qrCode = require("qrcode");

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL!}`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("X-Token", `${(getState() as RootState).auth.token}`);
      return headers;
    },
  }),
  tagTypes: ["balance"],
  endpoints: (builder) => ({
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
    getInfo: builder.query<{ alias: string; balance: number }, void>({
      query: () => "/info",
      providesTags: ["balance"],
    }),
    getInvoice: builder.mutation<
      { paymentRequest: string; svg: string },
      { value: number }
    >({
      query: (data) => ({
        url: "/get-invoice",
        method: "POST",
        body: data,
      }),
      transformResponse: ({ paymentRequest }: { paymentRequest: string }) => {
        let svg = "";
        qrCode.toString(
          paymentRequest,
          {
            errorCorrectionLevel: "H",
            type: "svg",
          },
          function (err: any, data: string) {
            if (err) throw err;
            svg = data;
          }
        );
        return { paymentRequest, svg };
      },
    }),
    sendPayment: builder.mutation<
      { success: boolean },
      { paymentRequest: string }
    >({
      query: (data) => ({
        url: "/pay-invoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["balance"],
    }),
    // type this later - you can find the type with typeof keyof
    listChannels: builder.query<{ channels: any[] }, void>({
      query: () => "/list-channels",
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
  }),
});

export const {
  useConnectMutation,
  useGetInfoQuery,
  useGetInvoiceMutation,
  useSendPaymentMutation,
  useListChannelsQuery,
  useGetNodeInfoQuery,
} = apiSlice;
