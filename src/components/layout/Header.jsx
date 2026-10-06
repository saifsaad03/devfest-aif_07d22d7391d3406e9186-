import { useTranslation } from 'react-i18next';
import LangToggle from '../common/LangToggle.jsx';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';

export default function Header({ onReset }) {
  const { t } = useTranslation();
  const tenderId = useRequirementsStore((s) => s.tenderId);
  const loaded = useRequirementsStore((s) => s.loaded);

  return (
    <header className="app-header">
      <div>
        <h1>{t('app.title')}</h1>
        <p className="subtitle">{t('app.tagline')}</p>
      </div>
      <div className="header-right">
        <span className={`tender-chip ${loaded ? '' : 'empty'}`}>
          {t('header.tenderId')}: {loaded ? tenderId || '—' : t('header.noTenderId')}
        </span>
        <LangToggle />
        <button type="button" className="btn btn-sm btn-danger" onClick={onReset}>
          {t('header.reset')}
        </button>
      </div>
    </header>
  );
}
