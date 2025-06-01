// features/overlay/overlaySlice.js
import { createSlice } from '@reduxjs/toolkit';

const overlaySlice = createSlice({
  name: 'overlay',
  initialState: {
    isVisible: false,
  },
  reducers: {
    showOverlay: (state) => {
      state.isVisible = true;
    },
    hideOverlay: (state) => {
      state.isVisible = false;
    },
    toggleOverlay: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { showOverlay, hideOverlay, toggleOverlay } = overlaySlice.actions;
export default overlaySlice.reducer;