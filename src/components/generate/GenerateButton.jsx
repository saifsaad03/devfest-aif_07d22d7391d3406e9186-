import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStatus } from '../../hooks/useStatus.js';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';
import { useAppStore } from '../../store/useAppStore.js';
import { generatePackage, downloadPdf } from '../../services/packageGenerator.js';

export default function GenerateButton() {
  const { t } = useTranslation();
  const { rows, canGenerate } = useStatus();
  const tenderId = useRequirementsStore((s) => s.tenderId);
  const pushToast = useAppStore((s) => s.pushToast);
  const [working, setWorking] = useState(false);

  async function onGenerate() {
    if (!canGenerate || working) return;
    setWorking(true);
    try {
      const { bytes, pageCount, docCount } = await generatePackage({
        tenderId,
        rows,
        t,
      });
      const name = `tender-package-${tenderId || 'export'}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      downloadPdf(bytes, name);
      pushToast(
        t('generate.done', { name: `${name} (${docCount} docs, ${pageCount} pages)` }),
        'success'
      );
    } catch (err) {
      pushToast(t('generate.error', { msg: err?.message || String(err) }), 'error');
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="generate-side">
      <button
        type="button"
        className="btn btn-primary"
        disabled={!canGenerate || working}
        onClick={onGenerate}
      >
        {working ? (
          <span className="spinner" />
        ) : (
          <svg
            className="icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
        )}
        {working ? t('generate.working') : t('generate.button')}
      </button>
      {!canGenerate && <span className="blocked-note">{t('generate.blocked')}</span>}
    </div>
  );
}
