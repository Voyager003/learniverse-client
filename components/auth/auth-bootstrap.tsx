'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';

export function AuthBootstrap() {
  const { initialize } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    void initialize();
  }, [initialize]);

  return null;
}

