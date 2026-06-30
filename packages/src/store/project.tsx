import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Project, Secret } from '../types/index.js';
import * as projectApi from '../api/project.js';
import * as secretApi from '../api/secret.js';

interface ProjectContextValue {
  projects: Project[];
  selectedProject: Project | null;
  secrets: Secret[];
  isLoadingProjects: boolean;
  isLoadingSecrets: boolean;
  projectsError: string | null;
  secretsError: string | null;
  fetchProjects: () => Promise<void>;
  selectProject: (project: Project | null) => void;
  fetchSecrets: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingSecrets, setIsLoadingSecrets] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [secretsError, setSecretsError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setProjectsError(null);
    try {
      const data = await projectApi.getProjects();
      setProjects(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'failed to load projects';
      setProjectsError(msg);
      if (err?.response?.status === 401) setProjectsError('session expired — sign in again');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const selectProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
    if (!project) setSecrets([]);
  }, []);

  const fetchSecrets = useCallback(async (projectId: string) => {
    setIsLoadingSecrets(true);
    setSecretsError(null);
    try {
      const data = await secretApi.getSecrets(projectId);
      setSecrets(data);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'failed to load secrets';
      setSecretsError(msg);
      if (err?.response?.status === 401) setSecretsError('session expired — sign in again');
    } finally {
      setIsLoadingSecrets(false);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{ projects, selectedProject, secrets, isLoadingProjects, isLoadingSecrets, projectsError, secretsError, fetchProjects, selectProject, fetchSecrets }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectStore() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectStore must be used within ProjectProvider');
  return ctx;
}
