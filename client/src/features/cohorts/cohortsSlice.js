import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch all cohorts
export const fetchCohorts = createAsyncThunk(
  'cohorts/fetchAll', // match this with the name below
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/cohort/all-cohorts`, {
        withCredentials: true,
      });
      return response.data.data; // This should be an array of cohorts
    } catch (error) {
      console.log("cohort error: ", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cohorts'
      );
    }
  }
);

// Create the slice
const cohortsSlice = createSlice({
  name: 'cohorts', // 🔁 This should match the store key and the async thunk prefix
  initialState: {
    allCohorts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCohorts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fulfilled payload:", action.payload);
        state.allCohorts = action.payload;
      })

      .addCase(fetchCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cohortsSlice.reducer;
