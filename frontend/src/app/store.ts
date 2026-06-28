import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/project/projectSlice";
import secretReducer from "../features/secret/secretSlice";
import environmentReducer from "../features/environment/environmentSlice";

import auditReducer from "../features/audit/auditSlice";
import teamReducer from "../features/team/teamSlice";
import { baseApi } from "../api/baseApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    secret: secretReducer,
    environment: environmentReducer,

    audit: auditReducer,
    team: teamReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
