import { useTranslation } from 'react-i18next';
import { useUploadsStore } from '../../store/useUploadsStore.js';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';
import { useSelection } from '../../store/selectors.js';
import StatusBadge from '../status/StatusBadge.jsx';

export default function UploadCard({ upload, unmatched }) {
  const { t, i18n } = useTranslation();
  const removeUpload = useUploadsStore((s) => s.removeUpload);
  const setManualDoc = useUploadsStore((s) => s.setManualDoc);
  const documents = useRequirementsStore((s) => s.documents);
  const { rows } = useSelection();

  const row = rows.find((r) => r.upload?.fileId === upload.fileId);
  const status = upload.parseError ? 'MISSING' : row?.status;
  const matchedDoc = row?.doc;

  const label = (d) =>
    i18n.language?.startsWith('bn') ? d.title_bn : d.title_en;

  return (
    <div className="file-row">
      <div className="file-head">
        <div>
          <div className="file-name">{upload.fileName}</div>
          <div className="file-sub">
            {upload.parseError
              ? upload.parseError
              : t('upload.pageCount', { count: upload.pageCount })}
            {row && !unmatched && matchedDoc ? ` · ${label(matchedDoc)}` : ''}
            {upload.manualDocId ? ` (${t('upload.manual')})` : ''}
          </div>
        </div>
        {!unmatched && <StatusBadge status={status} />}
      </div>

      <div className="file-controls">
        <label>
          {t('upload.assign')}:
          <select
            value={upload.manualDocId || ''}
            onChange={(e) => setManualDoc(upload.fileId, e.target.value)}
          >
            <option value="">{t('upload.assignPlaceholder')}</option>
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.order}. {label(d)}
              </option>
            ))}
          </select>
        </label>

        {matchedDoc?.has_expiry && (
          <span className="tag">{t('requirements.hasExpiry')} → {t('requirements.expiryDate')}</span>
        )}

        <button
          type="button"
          className="btn btn-sm btn-danger push-right"
          onClick={() => removeUpload(upload.fileId)}
        >
          {t('upload.remove')}
        </button>
      </div>
    </div>
  );
}
