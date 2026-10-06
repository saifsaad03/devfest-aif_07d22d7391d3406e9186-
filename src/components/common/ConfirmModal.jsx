import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{t('header.reset')}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
