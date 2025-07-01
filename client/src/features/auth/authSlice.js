import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  isAuthenticated: false,

  admin:null
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setAdmin: (state, action) => {
      state.admin = action.payload
    },
    unsetAdmin: (state) => {
      state.admin = null
    }
  },
});

export const {

  setIsAuthenticated,

  setAdmin,
  unsetAdmin
} = authorizationSlice.actions;

export default authorizationSlice.reducer;