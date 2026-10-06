import { useAppStore } from '../../store/useAppStore.js';

export default function Toast() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toasts">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => dismiss(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
