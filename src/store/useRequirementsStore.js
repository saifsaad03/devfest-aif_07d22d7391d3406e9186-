import { create } from 'zustand';

const REQ_KEY = 'tdpb_requirements';

function loadInitial() {
  try {
    const raw = localStorage.getItem(REQ_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { tender_id: '', documents: [] };
}

function validate(data) {
  if (!data || typeof data !== 'object') throw new Error('not an object');
  if (!Array.isArray(data.documents)) throw new Error('documents must be an array');
  for (const d of data.documents) {
    if (!d.id || !d.title_en) throw new Error('each document needs id and title_en');
  }
  return {
    tender_id: String(data.tender_id || ''),
    documents: data.documents.map((d, i) => ({
      id: String(d.id),
      title_en: String(d.title_en),
      title_bn: String(d.title_bn || d.title_en),
      required: d.required !== false,
      has_expiry: d.has_expiry === true,
      order: Number.isFinite(d.order) ? d.order : i + 1,
      match_keywords: Array.isArray(d.match_keywords) ? d.match_keywords.map(String) : [],
      expiryDate: '',
    })),
  };
}

export const useRequirementsStore = create((set, get) => ({
  tenderId: loadInitial().tender_id,
  documents: loadInitial().documents,
  loaded: loadInitial().documents.length > 0,

  loadFromJson: (data) => {
    const parsed = validate(data);
    const next = { tender_id: parsed.tender_id, documents: parsed.documents };
    localStorage.setItem(REQ_KEY, JSON.stringify(next));
    set({ tenderId: parsed.tender_id, documents: parsed.documents, loaded: true });
  },

  setExpiry: (docId, date) => {
    const documents = get().documents.map((d) =>
      d.id === docId ? { ...d, expiryDate: date } : d
    );
    localStorage.setItem(REQ_KEY, JSON.stringify({ tender_id: get().tenderId, documents }));
    set({ documents });
  },

  clear: () => {
    localStorage.removeItem(REQ_KEY);
    set({ tenderId: '', documents: [], loaded: false });
  },
}));
