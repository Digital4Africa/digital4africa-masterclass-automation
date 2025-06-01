import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from '../features/auth/authSlice';

import overlayReducer from '../features/overlay/overlaySlice'



const store = configureStore({
	reducer: {

		authorization: authorizationReducer,

		overlay: overlayReducer



	}
})
export default store