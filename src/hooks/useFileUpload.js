import { useTranslation } from 'react-i18next';
import { useUploadsStore } from '../store/useUploadsStore.js';
import { useAppStore } from '../store/useAppStore.js';
import { extractPdfInfo } from '../services/pdfParser.js';
import { hashText, hashBytes } from '../services/duplicateDetector.js';

export function useFileUpload() {
  const { t } = useTranslation();
  const addUploads = useUploadsStore((s) => s.addUploads);
  const setParsing = useUploadsStore((s) => s.setParsing);
  const pushToast = useAppStore((s) => s.pushToast);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const valid = [];
    for (const f of files) {
      const isPdf =
        f.type === 'application/pdf' || /\.pdf$/i.test(f.name || '');
      if (isPdf) valid.push(f);
      else pushToast(t('upload.notPdf', { name: f.name }), 'error');
    }
    if (valid.length === 0) return;

    setParsing(true);
    const items = [];
    try {
      for (const file of valid) {
        try {
          const { pageCount, text, bytes } = await extractPdfInfo(file);
          const [contentHash, byteHash] = [await hashText(text), await hashBytes(bytes)];
          items.push({
            fileId: crypto.randomUUID(),
            fileName: file.name,
            pageCount,
            extractedText: text.slice(0, 60000),
            contentHash,
            byteHash,
            bytes,
            manualDocId: null,
            parseError: null,
          });
        } catch (err) {
          items.push({
            fileId: crypto.randomUUID(),
            fileName: file.name,
            pageCount: 0,
            extractedText: '',
            contentHash: null,
            byteHash: null,
            bytes: null,
            manualDocId: null,
            parseError: err?.message || 'Failed to read PDF',
          });
          pushToast(t('upload.notPdf', { name: file.name }), 'error');
        }
      }
      addUploads(items);
    } finally {
      setParsing(false);
    }
  }

  return { handleFiles, parsing: useUploadsStore((s) => s.parsing) };
}
