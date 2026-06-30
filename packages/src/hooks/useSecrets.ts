import { useEffect } from 'react';
import { useProjectStore } from '../store/project.js';
import { useUiStore } from '../store/ui.js';
import * as secretApi from '../api/secret.js';
import type { Route } from '../types/index.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function useSecrets(goTo: (route: Route) => void) {
  const { selectedProject, secrets, isLoadingSecrets, fetchSecrets } = useProjectStore();
  const { addNotification } = useUiStore();

  useEffect(() => {
    if (selectedProject) {
      fetchSecrets(selectedProject._id);
    }
  }, [selectedProject]);

  const pullSecrets = async (): Promise<string> => {
    if (!selectedProject) return '';

    try {
      const result = await secretApi.getSecrets(selectedProject._id);
      const envContent = result.map((s) => `${s.secName}=${s.secKey}`).join('\n');
      const envPath = path.join(process.cwd(), '.env');
      fs.writeFileSync(envPath, envContent, 'utf-8');
      addNotification('success', `.env saved with ${result.length} secrets`);
      return envPath;
    } catch {
      addNotification('error', 'Failed to pull secrets');
      return '';
    }
  };

  return { selectedProject, secrets, isLoadingSecrets, pullSecrets };
}
