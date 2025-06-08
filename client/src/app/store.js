import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "../features/auth/authSlice";
import overlayReducer from "../features/overlay/overlaySlice";
import allMasterClassesReducer from "../features/masterclass/fetchAllMasterclassesSlice";
import allCohortsReducer from "../features/cohorts/cohortsSlice";
import studentsCohortReducer from "../features/cohorts/cohortsSliceStudentsDetails"

const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    overlay: overlayReducer,
    allMasterclasses: allMasterClassesReducer,
    cohorts: allCohortsReducer,
    studentsCohorts: studentsCohortReducer
  },
});

export default store;
