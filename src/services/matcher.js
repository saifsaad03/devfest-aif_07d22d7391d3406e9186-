function normalize(str) {
  return (str || '').toLowerCase().trim();
}

function haystackFor(upload) {
  return normalize(`${upload.fileName} ${upload.extractedText || ''}`);
}

function keywordMatches(upload, doc) {
  const hay = haystackFor(upload);
  const keywords = doc.match_keywords || [];
  return keywords.some((k) => k && hay.includes(normalize(k)));
}

export function computeMatchMap(documents, uploads) {
  const docByUpload = new Map();
  const uploadByDoc = new Map();
  const sortedDocs = [...documents].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  for (const u of uploads) {
    if (u.parseError) continue;
    if (u.manualDocId && !uploadByDoc.has(u.manualDocId)) {
      const doc = sortedDocs.find((d) => d.id === u.manualDocId);
      if (doc) {
        docByUpload.set(u.fileId, doc.id);
        uploadByDoc.set(doc.id, u.fileId);
      }
    }
  }

  for (const doc of sortedDocs) {
    if (uploadByDoc.has(doc.id)) continue;
    const match = uploads.find(
      (u) => !u.parseError && !docByUpload.has(u.fileId) && keywordMatches(u, doc)
    );
    if (match) {
      docByUpload.set(match.fileId, doc.id);
      uploadByDoc.set(doc.id, match.fileId);
    }
  }

  return { docByUpload, uploadByDoc };
}
