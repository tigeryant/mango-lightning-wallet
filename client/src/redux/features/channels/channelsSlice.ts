import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ChannelsState {
  channelState: string
}

const initialState: ChannelsState = {
  channelState: '',
}

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannelState: (state, action: PayloadAction<string>) => {
      state.channelState = action.payload;
    },
  },
})

export const { setChannelState } = channelsSlice.actions

export default channelsSlice.reducer