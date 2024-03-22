import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { setChannelState } from "../channels/channelsSlice";

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
  tagTypes: ["balance", "channels"],
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
      providesTags: ["channels"],
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
    newAddress: builder.query<{ address: string }, void>({
      query: () => "/new-address",
    }),
    openChannel: builder.mutation< { success: boolean }, { pubkey: string; fundingAmount: number, pushSat: number } >({
      query: (data) => ({
        url: "/open-channel",
        method: "POST",
        body: data,
      }),
      // could use queryFulfilled here??
      async onQueryStarted(
        arg,
        {
          dispatch,
        }
      ) {
        dispatch(setChannelState(''))
      },
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        console.log("connecting to WS");
        setTimeout(async function () {
          // replace with environment variable
          const ws = new WebSocket("ws://localhost:8080");
          try {
            await cacheDataLoaded;
            ws.onmessage = (event: MessageEvent) => {
              const data = event.data;
              dispatch(setChannelState(data));
            };
            ws.onerror = (error) => {
              console.error(error);
            };
            ws.onclose = () => {
              dispatch(apiSlice.util.invalidateTags(['channels']))
              console.log("websocket closed");
            };
          } catch (err) {
            console.error(`error: ${err}`);
          }
          await cacheEntryRemoved;
          ws.close();
        }, 100);
      },
    }),
    closeChannel: builder.mutation< { success: boolean }, { channelPoint: string } >({
      query: (data) => ({
        url: "/close-channel",
        method: "POST",
        body: data,
      }),
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        console.log("connecting to WS");
        setTimeout(async function () {
          // replace with environment variable
          const ws = new WebSocket("ws://localhost:8080");
          try {
            await cacheDataLoaded;
            ws.onmessage = (event: MessageEvent) => {
              const data = event.data;
              console.log(`data: ${data}`)
              // dispatch(setChannelState(data));
            };
            ws.onerror = (error) => {
              console.error(error);
            };
            ws.onclose = () => {
              dispatch(apiSlice.util.invalidateTags(['channels']))
              console.log("websocket closed");
            };
          } catch (err) {
            console.error(`error: ${err}`);
          }
          await cacheEntryRemoved;
          ws.close();
        }, 100);
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
  useNewAddressQuery,
  useOpenChannelMutation,
  useCloseChannelMutation,
} = apiSlice;
