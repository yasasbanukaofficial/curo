import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Audit } from "../../types/audit";

interface AuditState {
  selectedLog: Audit | null;
}

const initialState: AuditState = {
  selectedLog: null,
};

export const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setSelectedLog: (state, action: PayloadAction<Audit | null>) => {
      state.selectedLog = action.payload;
    },
  },
});

export const { setSelectedLog } = auditSlice.actions;

export const selectSelectedLog = (state: { audit: AuditState }) =>
  state.audit.selectedLog;

export default auditSlice.reducer;
