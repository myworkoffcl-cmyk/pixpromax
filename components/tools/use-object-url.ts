"use client";

import { useEffect, useMemo } from "react";

export function useObjectUrl(value: Blob | null): string | null {
  const url = useMemo(() => value ? URL.createObjectURL(value) : null, [value]);
  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [url]);
  return url;
}
