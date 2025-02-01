import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  originalUrl: '',
  customNanoId: '',
  expiresAt: '',
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrlData(state, action) {
      state.originalUrl = action.payload.originalUrl;
      state.customNanoId = action.payload.customNanoId || '';
      state.expiresAt = action.payload.expiresAt || '';
    },
    clearUrlData(state) {
      state.originalUrl = '';
      state.customNanoId = '';
      state.expiresAt = '';
    },
  },
});

export const { setUrlData, clearUrlData } = urlSlice.actions;
export default urlSlice.reducer;