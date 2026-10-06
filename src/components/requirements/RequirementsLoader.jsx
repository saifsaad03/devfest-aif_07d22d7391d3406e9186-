import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequirementsLoader } from '../../hooks/useRequirementsLoader.js';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';
import RequirementCard from './RequirementCard.jsx';

export default function RequirementsLoader() {
  const { t } = useTranslation();
  const { error, setError, parseAndLoad, loadFromFile } = useRequirementsLoader();
  const [paste, setPaste] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const fileRef = useRef(null);

  const documents = useRequirementsStore((s) => s.documents);
  const loaded = useRequirementsStore((s) => s.loaded);
  const clear = useRequirementsStore((s) => s.clear);

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) await loadFromFile(file);
    e.target.value = '';
  }

  async function loadSample() {
    const res = await fetch('/requirements.sample.json');
    const text = await res.text();
    parseAndLoad(text);
  }

  return (
    <section className="card">
      <h2>{t('requirements.step')}</h2>
      <p className="section-hint">{t('requirements.dropHint')}</p>

      <div
        className="dropzone"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          await loadFromFile(e.dataTransfer.files?.[0]);
        }}
      >
        <span className="drop-icon" aria-hidden="true">
          <svg
            className="icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
          </svg>
        </span>
        <div className="drop-main">{t('requirements.loadFile')}</div>
        <div className="drop-sub">{t('requirements.dropHint')}</div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      <div className="row" style={{ marginTop: 10 }}>
        <button type="button" className="btn btn-sm" onClick={() => setShowPaste((v) => !v)}>
          {t('requirements.pasteLabel')}
        </button>
        <button type="button" className="btn btn-sm" onClick={loadSample}>
          {t('requirements.clickToLoadSample')}
        </button>
        {loaded && (
          <button type="button" className="btn btn-sm btn-danger" onClick={clear}>
            {t('requirements.clear')}
          </button>
        )}
      </div>

      {showPaste && (
        <div style={{ marginTop: 10 }}>
          <textarea
            className="json-input"
            value={paste}
            placeholder='{"tender_id":"...","documents":[...]}'
            onChange={(e) => setPaste(e.target.value)}
          />
          <div className="row" style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => parseAndLoad(paste)}
            >
              {t('requirements.load')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-note" onClick={() => setError(null)}>
          {t('requirements.invalid', { msg: error })}
        </div>
      )}

      {loaded && documents.length > 0 ? (
        <div className="list">
          {documents.map((d) => (
            <RequirementCard key={d.id} doc={d} />
          ))}
        </div>
      ) : (
        <div className="empty-note">{t('requirements.empty')}</div>
      )}
    </section>
  );
}
