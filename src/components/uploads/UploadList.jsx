import { useTranslation } from 'react-i18next';
import { useUploadsStore } from '../../store/useUploadsStore.js';
import { useSelection } from '../../store/selectors.js';
import UploadCard from './UploadCard.jsx';

export default function UploadList() {
  const { t } = useTranslation();
  const uploads = useUploadsStore((s) => s.uploads);
  const { unmatchedUploads } = useSelection();

  if (uploads.length === 0) {
    return <div className="empty-note">{t('upload.empty')}</div>;
  }

  const unmatchedIds = new Set(unmatchedUploads.map((u) => u.fileId));

  return (
    <div className="list">
      {uploads.map((u) => (
        <UploadCard key={u.fileId} upload={u} unmatched={unmatchedIds.has(u.fileId)} />
      ))}
      {unmatchedUploads.length > 0 && (
        <div className="warning-note">
          <strong>{t('status.unmatchedTitle')}</strong> — {t('status.unmatchedHint')}
        </div>
      )}
    </div>
  );
}
