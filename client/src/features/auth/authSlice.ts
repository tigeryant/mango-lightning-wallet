import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { apiSlice } from '../api/apiSlice'

interface AuthState {
  token: string
}

const initialState: AuthState = {
  token: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.connect.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token
      }
    )
  }
})

export const { setToken } = authSlice.actions
export const selectToken = (state: RootState) => state.auth.token
export default authSlice.reducer
