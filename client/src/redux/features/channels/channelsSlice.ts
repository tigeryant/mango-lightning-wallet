import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ChannelsState {
  channelState: any
}

const initialState: ChannelsState = {
  channelState: {},
}

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelState: (state, action: PayloadAction<any>) => {
      state.channelState = action.payload;
    },
  },
})

export const { setChannelState } = channelsSlice.actions

export default channelsSlice.reducer