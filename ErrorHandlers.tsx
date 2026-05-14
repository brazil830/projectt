'use client';

import { useEffect } from 'react';

export default function ErrorHandlers() {
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      event.preventDefault();
      console.error('Unhandled error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}