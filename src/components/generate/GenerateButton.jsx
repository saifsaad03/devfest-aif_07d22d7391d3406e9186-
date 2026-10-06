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
        {working && <span className="spinner" />}
        {working ? t('generate.working') : t('generate.button')}
      </button>
      {!canGenerate && <span className="blocked-note">{t('generate.blocked')}</span>}
    </div>
  );
}
