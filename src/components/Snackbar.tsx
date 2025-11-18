import React, { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | undefined;
  duration?: number;
  position?:
    | 'center'
    | 'center-right'
    | 'center-left'
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';
  onClose?: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom-center',
  onClose,
}) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [message, duration, onClose]);

  if (!visible) return null;

  const typeStyles: Record<string, string> = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  const positionStyles: Record<string, string> = {
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-4 transform -translate-y-1/2',
    'center-left': 'top-1/2 left-4 transform -translate-y-1/2',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`fixed z-50 px-4 py-2 rounded shadow-lg ${typeStyles[type]} ${
        positionStyles[position]
      } transition-opacity duration-300`}
    >
      {message}
    </div>
  );
};

export default Snackbar;