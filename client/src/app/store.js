import { configureStore } from "@reduxjs/toolkit";

import authorizationReducer from "../features/auth/authSlice";
import overlayReducer from "../features/overlay/overlaySlice";
import allMasterClassesReducer from "../features/masterclass/fetchAllMasterclassesSlice";
import allCohortsReducer from "../features/cohorts/cohortsSlice";
import studentsCohortReducer from "../features/cohorts/cohortsSliceStudentsDetails"
import paymentsReducer from "../features/payments/fetchAllPaymentsSlice"
const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    overlay: overlayReducer,
    allMasterclasses: allMasterClassesReducer,
    cohorts: allCohortsReducer,
    studentsCohorts: studentsCohortReducer,
    payments: paymentsReducer
  },
});

export default store;
