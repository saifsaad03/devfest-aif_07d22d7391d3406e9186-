import { useTranslation } from 'react-i18next';
import StatusBadge from '../status/StatusBadge.jsx';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';
import { useSelection } from '../../store/selectors.js';

export default function RequirementCard({ doc }) {
  const { t, i18n } = useTranslation();
  const setExpiry = useRequirementsStore((s) => s.setExpiry);
  const { rows } = useSelection();
  const row = rows.find((r) => r.doc.id === doc.id);
  const status = row?.status;

  const title = i18n.language?.startsWith('bn') ? doc.title_bn : doc.title_en;

  return (
    <div className="doc-row">
      <div className="doc-top">
        <div>
          <div className="doc-title">
            {doc.order}. {title}
          </div>
          <div className="doc-meta">
            <span className={`tag ${doc.required ? 'required' : ''}`}>
              {doc.required ? t('requirements.required') : t('requirements.optional')}
            </span>
            {doc.has_expiry && <span className="tag">{t('requirements.hasExpiry')}</span>}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {doc.has_expiry && (
        <div className="expiry-field">
          <label htmlFor={`expiry-${doc.id}`}>{t('requirements.expiryDate')}:</label>
          <input
            id={`expiry-${doc.id}`}
            type="date"
            value={doc.expiryDate || ''}
            onChange={(e) => setExpiry(doc.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
