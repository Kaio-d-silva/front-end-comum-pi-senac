import React, { useEffect, useRef, useState } from 'react';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

type SnackbarPosition =
  | 'center'
  | 'center-right'
  | 'center-left'
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right';

interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  duration?: number;
  position?: SnackbarPosition;
  onClose?: () => void;
}

const TYPE_STYLES: Record<SnackbarType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
};

const POSITION_STYLES: Record<SnackbarPosition, string> = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'top-1/2 right-4 -translate-y-1/2',
  'center-left': 'top-1/2 left-4 -translate-y-1/2',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom-center',
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // se não tiver mensagem, esconde e limpa timer
    if (!message) {
      setVisible(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setVisible(true);

    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      timerRef.current = null;
      if (onClose) onClose();
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [message, duration, onClose]);

  if (!visible) return null;

  const typeClass = TYPE_STYLES[type] ?? TYPE_STYLES.info;
  const positionClass = POSITION_STYLES[position];

  // role / aria-live para acessibilidade
  const isError = type === 'error';
  const role = isError ? 'alert' : 'status';
  const ariaLive = isError ? 'assertive' : 'polite';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`fixed z-50 max-w-sm rounded-lg px-4 py-2 text-sm shadow-lg transition-opacity duration-300 ${typeClass} ${positionClass}`}
    >
      {message}
    </div>
  );
};

export default Snackbar;
