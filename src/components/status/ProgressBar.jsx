import { useTranslation } from 'react-i18next';
import { useStatus } from '../../hooks/useStatus.js';

export default function ProgressBar() {
  const { t } = useTranslation();
  const { progress, okCount, totalRequired, blocking } = useStatus();

  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{t('status.ready', { ok: okCount, total: totalRequired })}</span>
        <span className={blocking.length ? 'blocked-note' : ''}>
          {blocking.length ? t('status.blocked', { count: blocking.length }) : ''}
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${blocking.length ? 'blocked' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
