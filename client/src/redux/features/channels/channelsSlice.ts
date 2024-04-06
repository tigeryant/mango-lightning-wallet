import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

interface ChannelsState {
  channelState: string;
  success: boolean | undefined
}

const initialState: ChannelsState = {
  channelState: "",
  success: undefined
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannelState: (state, action: PayloadAction<string>) => {
      state.channelState = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
  },
});

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // type this later - you can find the type with typeof keyof
    listChannels: builder.query<{ channels: any[] }, void>({
      query: () => "/channels/list",
      providesTags: ["channels"],
    }),
    openChannel: builder.mutation<
      { success: boolean },
      { pubkey: string; fundingAmount: number; pushSat: number }
    >({
      query: (data) => ({
        url: "/channels/open",
        method: "POST",
        body: data,
      }),
      // could use queryFulfilled here??
      async onQueryStarted(arg, { dispatch }) {
        dispatch(setChannelState(""));
      },
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, getCacheEntry }
      ) {
        setTimeout(async function () {
          const { isSuccess } = getCacheEntry();
          dispatch(setSuccess(isSuccess))
          if (isSuccess) {
            console.log("connecting to WS");
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
                dispatch(apiSlice.util.invalidateTags(["channels"]));
                console.log("websocket closed");
              };
            } catch (err) {
              console.error(`error: ${err}`);
            }
            await cacheEntryRemoved;
            ws.close();
          }
        }, 100);
      },
    }),
    closeChannel: builder.mutation<
      { success: boolean },
      { channelPoint: string }
    >({
      query: (data) => ({
        url: "/channels/close",
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
              console.log(`data: ${data}`);
              // dispatch(setChannelState(data));
            };
            ws.onerror = (error) => {
              console.error(error);
            };
            ws.onclose = () => {
              dispatch(apiSlice.util.invalidateTags(["channels"]));
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
  useListChannelsQuery,
  useOpenChannelMutation,
  useCloseChannelMutation,
} = extendedApiSlice;
export const selectListChannelsResult =
  extendedApiSlice.endpoints.listChannels.select();
export const { setChannelState, setSuccess } = channelsSlice.actions;
export default channelsSlice.reducer;
