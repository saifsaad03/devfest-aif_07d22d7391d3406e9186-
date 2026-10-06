function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .trim();
}

async function sha256Hex(data) {
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashText(text) {
  const normalized = normalize(text);
  return sha256Hex(new TextEncoder().encode(normalized));
}

export async function hashBytes(bytes) {
  return sha256Hex(bytes);
}

export function findDuplicateGroups(uploads) {
  const byHash = new Map();
  for (const u of uploads) {
    if (!u.contentHash || u.parseError) continue;
    const key = u.contentHash;
    if (!byHash.has(key)) byHash.set(key, []);
    byHash.get(key).push(u);
  }
  const duplicateIds = new Set();
  for (const group of byHash.values()) {
    if (group.length > 1) {
      for (const u of group) duplicateIds.add(u.fileId);
    }
  }
  return duplicateIds;
}
