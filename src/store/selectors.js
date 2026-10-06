import { useRequirementsStore } from './useRequirementsStore.js';
import { useUploadsStore } from './useUploadsStore.js';
import { evaluateStatuses } from '../services/statusEngine.js';

export function useSelection() {
  const documents = useRequirementsStore((s) => s.documents);
  const uploads = useUploadsStore((s) => s.uploads);
  return evaluateStatuses(documents, uploads);
}
