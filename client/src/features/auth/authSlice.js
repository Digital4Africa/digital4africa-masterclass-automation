import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  isAuthenticated: false,
 
  user:null
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload
    },
    unsetUser: (state) => {
      state.user = null
    }
  },
});

export const {

  setIsAuthenticated,

  setUser,
  unsetUser
} = authorizationSlice.actions;

export default authorizationSlice.reducer;