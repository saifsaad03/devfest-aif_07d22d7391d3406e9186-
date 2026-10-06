import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../i18n/index.js';

export default function LangToggle() {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('bn') ? 'bn' : 'en';

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={current === 'en' ? 'active' : ''}
        onClick={() => setLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        className={current === 'bn' ? 'active' : ''}
        onClick={() => setLanguage('bn')}
        title={t('app.title')}
      >
        বাংলা
      </button>
    </div>
  );
}
