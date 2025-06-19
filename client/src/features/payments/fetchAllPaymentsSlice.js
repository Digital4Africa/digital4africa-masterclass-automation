import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async ({
    page = 1,
    limit = '10',
    fromDate = '',
    toDate = '',
    status = 'all'
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, status });

      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);

      const response = await axios.get(`${apiUrl}/api/v1/enrollment/payments?${params.toString()}`, {
        withCredentials: true
      });

      console.log("response", response.data);

      return response.data;
    } catch (err) {
      console.log("error", err);
      const message = err.response?.data?.message || err.message || 'Failed to fetch payments';
      return rejectWithValue(message);
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {
      limit: '10',
      fromDate: '',
      toDate: '',
      status: 'all'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPage: (state) => {
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload.data;
        state.currentPage = action.payload.meta.currentPage;
        state.totalPages = action.payload.meta.totalPages;
        state.loading = false;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetPage } = paymentsSlice.actions;
export default paymentsSlice.reducer;