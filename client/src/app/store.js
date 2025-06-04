import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "../features/auth/authSlice";
import overlayReducer from "../features/overlay/overlaySlice";
import allMasterClassesReducer from "../features/masterclass/fetchAllMasterclassesSlice";
import allCohortsReducer from "../features/cohorts/cohortsSlice";

const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    overlay: overlayReducer,
    allMasterclasses: allMasterClassesReducer,
    cohorts: allCohortsReducer,
  },
});

export default store;
