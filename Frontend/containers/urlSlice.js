import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  originalUrl: '',
  customNanoId: '',
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrlData(state, action) {
      state.originalUrl = action.payload.originalUrl;
      state.customNanoId = action.payload.customNanoId || '';
    },
    clearUrlData(state) {
      state.originalUrl = '';
      state.customNanoId = '';
    },
  },
});

export const { setUrlData, clearUrlData } = urlSlice.actions;
export default urlSlice.reducer;
