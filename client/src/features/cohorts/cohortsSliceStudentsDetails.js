import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch all cohorts
export const fetchStudentsCohorts = createAsyncThunk(
  'studentsCohorts/fetchAll', // match this with the name below
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/cohort/students-cohorts`, {

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
  name: 'studentsCohorts',
  initialState: {
    studentsCohorts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsCohorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsCohorts.fulfilled, (state, action) => {
        state.loading = false;
        
        state.studentsCohorts = action.payload;
      })

      .addCase(fetchStudentsCohorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cohortsSlice.reducer;
