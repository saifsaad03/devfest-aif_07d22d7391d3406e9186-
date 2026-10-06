import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '../../hooks/useFileUpload.js';
import { useRequirementsStore } from '../../store/useRequirementsStore.js';
import UploadList from './UploadList.jsx';
import DuplicateWarning from '../status/DuplicateWarning.jsx';

export default function FileDropzone() {
  const { t } = useTranslation();
  const { handleFiles, parsing } = useFileUpload();
  const loaded = useRequirementsStore((s) => s.loaded);

  const onDrop = useCallback(
    (accepted, rejected) => {
      if (rejected?.length) {
        handleFiles(rejected.map((r) => r.file));
      }
      if (accepted?.length) handleFiles(accepted);
    },
    [handleFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: parsing,
    disabled: parsing,
    multiple: true,
    validator: (file) =>
      file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
        ? null
        : { code: 'non-pdf', message: t('upload.onlyPdf') },
  });

  return (
    <section className="card">
      <h2>{t('upload.step')}</h2>
      <p className="section-hint">{t('upload.memoryNote')}</p>

      <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}>
        <input {...getInputProps()} />
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
        </span>
        <div className="drop-main">
          {parsing ? t('upload.parsing') : t('upload.dropzone')}
        </div>
        <div className="drop-sub">{t('upload.onlyPdf')}</div>
      </div>

      {!loaded && <div className="info-note">{t('requirements.empty')}</div>}

      <DuplicateWarning />
      <UploadList />
    </section>
  );
}
