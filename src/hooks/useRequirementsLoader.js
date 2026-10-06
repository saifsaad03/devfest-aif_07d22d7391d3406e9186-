import { useState } from 'react';
import { useRequirementsStore } from '../store/useRequirementsStore.js';
import { useAppStore } from '../store/useAppStore.js';

export function useRequirementsLoader() {
  const [error, setError] = useState(null);
  const loadFromJson = useRequirementsStore((s) => s.loadFromJson);
  const pushToast = useAppStore((s) => s.pushToast);

  function parseAndLoad(text) {
    try {
      const data = JSON.parse(text);
      loadFromJson(data);
      setError(null);
      pushToast(`Loaded ${data.documents?.length || 0} requirements`, 'success');
      return true;
    } catch (err) {
      setError(err.message || 'Invalid JSON');
      return false;
    }
  }

  async function loadFromFile(file) {
    if (!file) return false;
    if (!/\.json$/i.test(file.name) && file.type !== 'application/json') {
      setError('Please select a .json file');
      return false;
    }
    const text = await file.text();
    return parseAndLoad(text);
  }

  return { error, setError, parseAndLoad, loadFromFile };
}
