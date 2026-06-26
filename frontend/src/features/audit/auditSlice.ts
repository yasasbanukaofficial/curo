import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Audit } from "../../types/audit";

interface AuditState {
  items: Audit[];
  loading: boolean;
  error: string | null;
}

const initialState: AuditState = {
  items: [],
  loading: false,
  error: null,
};

export const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setAuditLogs: (state, action: PayloadAction<Audit[]>) => {
      state.items = action.payload;
    },
    addAuditLog: (state, action: PayloadAction<Audit>) => {
      state.items.unshift(action.payload);
    },
    setAuditLogsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuditLogsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAuditLogs, addAuditLog, setAuditLogsLoading, setAuditLogsError } = auditSlice.actions;
export default auditSlice.reducer;
