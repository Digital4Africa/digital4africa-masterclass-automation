import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch all masterclasses
export const fetchMasterclasses = createAsyncThunk(
	'masterclass/fetchAll',
	async (_, thunkAPI) => {
		try {
			const response = await axios.get(`${apiUrl}/api/v1/masterclass/all-masterclasses`, {
				withCredentials: true,
			});

			return response.data.data; // array of masterclasses
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch masterclasses');
		}
	}
);

// Slice
const masterclassSlice = createSlice({
	name: 'masterclass',
	initialState: {
		allMasterclasses: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMasterclasses.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMasterclasses.fulfilled, (state, action) => {
				state.loading = false;
				state.allMasterclasses = action.payload;
			})
			.addCase(fetchMasterclasses.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default masterclassSlice.reducer;
