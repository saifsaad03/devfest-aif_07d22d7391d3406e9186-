import { useTranslation } from 'react-i18next';
import { STATUS_COLORS } from '../../config/statusConfig.js';

export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  if (!status) return null;

  const colors = STATUS_COLORS[status] || { bg: '#f1f5f9', fg: '#334155' };

  return (
    <span className="badge" style={{ background: colors.bg, color: colors.fg }}>
      {t(`status.${status}`)}
    </span>
  );
}
