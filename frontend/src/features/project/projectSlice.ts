import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../../types/project";

interface ProjectState {
  selectedProject: Project | null;
}

const initialState: ProjectState = {
  selectedProject: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;

export const selectSelectedProject = (state: { project: ProjectState }) =>
  state.project.selectedProject;

export default projectSlice.reducer;
