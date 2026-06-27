import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/project/projectSlice";
import secretReducer from "../features/secret/secretSlice";
import environmentReducer from "../features/environment/environmentSlice";
import versionReducer from "../features/version/versionSlice";
import auditReducer from "../features/audit/auditSlice";
import teamReducer from "../features/team/teamSlice";
import { secretApi } from "../features/secret/secretApi";
import { projectApi } from "../features/project/projectApi";
import { environmentApi } from "../features/environment/environmentApi";
import { authApi } from "../features/auth/authApi";
import { teamApi } from "../features/team/teamApi";
import { auditApi } from "../features/audit/auditApi";
import { versionApi } from "../features/version/versionApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    secret: secretReducer,
    environment: environmentReducer,
    version: versionReducer,
    audit: auditReducer,
    team: teamReducer,
    [secretApi.reducerPath]: secretApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [environmentApi.reducerPath]: environmentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [auditApi.reducerPath]: auditApi.reducer,
    [versionApi.reducerPath]: versionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      secretApi.middleware,
      projectApi.middleware,
      environmentApi.middleware,
      authApi.middleware,
      teamApi.middleware,
      auditApi.middleware,
      versionApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
