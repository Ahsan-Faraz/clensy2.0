'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch');
    return r.json();
  }).then((res) => res?.data ?? null);

interface LocationPageWithSWRProps {
  slug: string;
  initialData: Record<string, unknown>;
  children: React.ReactNode;
}

/**
 * Wraps location page with SWR for client-side revalidation.
 * Refetches on focus/reconnect; on new data, triggers router.refresh() so edits in Strapi appear.
 */
export function LocationPageWithSWR({ slug, initialData, children }: LocationPageWithSWRProps) {
  const router = useRouter();
  const isInitialMount = useRef(true);

  const { data, isValidating } = useSWR(`/api/cms/locations/${slug}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isValidating && data) router.refresh();
  }, [data, isValidating, router]);

  return <>{children}</>;
}
