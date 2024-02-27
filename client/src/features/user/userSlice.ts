import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  alias: string
}

const initialState: UserState = {
  alias: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAlias: (state, action: PayloadAction<string>) => {
      state.alias = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAlias } = userSlice.actions

export default userSlice.reducer
