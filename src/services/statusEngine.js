import { STATUS } from '../config/statusConfig.js';
import { computeMatchMap } from './matcher.js';
import { findDuplicateGroups } from './duplicateDetector.js';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function evaluateStatuses(documents, uploads) {
  const { docByUpload, uploadByDoc } = computeMatchMap(documents, uploads);
  const duplicateIds = findDuplicateGroups(uploads);
  const uploadById = new Map(uploads.map((u) => [u.fileId, u]));

  const sortedDocs = [...documents].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const today = todayISO();

  const rows = sortedDocs.map((doc) => {
    const uploadId = uploadByDoc.get(doc.id);
    const upload = uploadId ? uploadById.get(uploadId) : null;
    let status;

    if (upload && upload.parseError) {
      status = doc.required ? STATUS.MISSING : STATUS.NOT_PROVIDED;
    } else if (!upload) {
      status = doc.required ? STATUS.MISSING : STATUS.NOT_PROVIDED;
    } else if (duplicateIds.has(upload.fileId)) {
      status = STATUS.DUPLICATE;
    } else if (doc.has_expiry) {
      if (!doc.expiryDate) status = STATUS.EXPIRY_NEEDED;
      else if (doc.expiryDate < today) status = STATUS.EXPIRED;
      else status = STATUS.OK;
    } else {
      status = STATUS.OK;
    }

    return { doc, upload, status };
  });

  const unmatchedUploads = uploads.filter(
    (u) => !u.parseError && !docByUpload.has(u.fileId)
  );

  const blocking = rows.filter(
    (r) => r.doc.required && r.status !== STATUS.OK
  );
  const canGenerate = blocking.length === 0 && rows.some((r) => r.upload);

  return { rows, unmatchedUploads, blocking, canGenerate };
}
