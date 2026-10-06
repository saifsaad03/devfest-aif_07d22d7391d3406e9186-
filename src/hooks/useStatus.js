import { useMemo } from 'react';
import { useSelection } from '../store/selectors.js';

export function useStatus() {
  const { rows, unmatchedUploads, blocking, canGenerate } = useSelection();

  const requiredRows = useMemo(
    () => rows.filter((r) => r.doc.required),
    [rows]
  );
  const okCount = useMemo(
    () => requiredRows.filter((r) => r.status === 'OK').length,
    [requiredRows]
  );

  return {
    rows,
    unmatchedUploads,
    blocking,
    canGenerate,
    totalRequired: requiredRows.length,
    okCount,
    progress: requiredRows.length
      ? Math.round((okCount / requiredRows.length) * 100)
      : 0,
  };
}
