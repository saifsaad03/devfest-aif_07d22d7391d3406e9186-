import { useTranslation } from 'react-i18next';
import { useUploadsStore } from '../../store/useUploadsStore.js';
import { findDuplicateGroups } from '../../services/duplicateDetector.js';

export default function DuplicateWarning() {
  const { t } = useTranslation();
  const uploads = useUploadsStore((s) => s.uploads);

  const dupIds = findDuplicateGroups(uploads);
  const names = uploads.filter((u) => dupIds.has(u.fileId)).map((u) => u.fileName);

  if (names.length === 0) return null;

  return (
    <div className="warning-note">
      <strong>{t('status.DUPLICATE')}:</strong> {names.join(', ')}
    </div>
  );
}
