import { useEffect, useMemo, useState } from 'react';
import { useProjectStore } from '../store/project.js';
import type { Route } from '../types/index.js';

export function useProjects(goTo: (route: Route) => void) {
  const { projects, isLoadingProjects, fetchProjects, selectProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => p.projectName.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const openProject = (index: number) => {
    const project = filteredProjects[index];
    if (project) {
      selectProject(project);
      goTo('project');
    }
  };

  return {
    projects: filteredProjects,
    isLoadingProjects,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    openProject,
  };
}
