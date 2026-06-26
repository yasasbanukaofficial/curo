import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Project } from "../../types/project";

interface ProjectState {
  items: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  items: [],
  selectedProject: null,
  loading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.items = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setProjectsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProjectsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setSelectedProject,
  setProjectsLoading,
  setProjectsError,
} = projectSlice.actions;
export default projectSlice.reducer;
