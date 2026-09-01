"use client";

import { useCallback, useEffect, useState } from "react";

export function useFormDraft<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) setValue({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt draft */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per key
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [hydrated, key, value]);

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  return { value, setValue, clearDraft, hydrated };
}
