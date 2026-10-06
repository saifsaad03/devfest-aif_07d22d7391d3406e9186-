export const STATUS = {
  MISSING: 'MISSING',
  EXPIRY_NEEDED: 'EXPIRY_NEEDED',
  EXPIRED: 'EXPIRED',
  NOT_PROVIDED: 'NOT_PROVIDED',
  OK: 'OK',
  DUPLICATE: 'DUPLICATE',
};

export const BLOCKING_STATUSES = new Set([
  STATUS.MISSING,
  STATUS.EXPIRY_NEEDED,
  STATUS.EXPIRED,
  STATUS.DUPLICATE,
]);

export const STATUS_COLORS = {
  [STATUS.OK]: { bg: '#dcfce7', fg: '#166534' },
  [STATUS.MISSING]: { bg: '#fee2e2', fg: '#991b1b' },
  [STATUS.EXPIRY_NEEDED]: { bg: '#fef9c3', fg: '#854d0e' },
  [STATUS.EXPIRED]: { bg: '#fee2e2', fg: '#991b1b' },
  [STATUS.NOT_PROVIDED]: { bg: '#e5e7eb', fg: '#374151' },
  [STATUS.DUPLICATE]: { bg: '#ffedd5', fg: '#9a3412' },
};
