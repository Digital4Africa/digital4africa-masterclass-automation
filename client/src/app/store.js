import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from '../features/auth/authSlice';

import overlayReducer from '../features/overlay/overlaySlice'
import allMasterClassesReducer from '../features/masterclass/fetchAllMasterclassesSlice'



const store = configureStore({
	reducer: {

		authorization: authorizationReducer,

		overlay: overlayReducer,
		allMasterclasses: allMasterClassesReducer



	}
})
export default store