'use client';

import useSWR from 'swr';
import type { ComponentType } from 'react';
import { transformServiceData } from '@/lib/service-transformers';

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Failed to fetch');
  const res = await r.json();
  return res?.data ?? null;
};

interface ServicePageWithSWRProps {
  slug: string;
  initialRawData: Record<string, unknown>;
  Template: ComponentType<{ data: Record<string, unknown> }>;
}

/**
 * Wraps service page with SWR for client-side revalidation.
 * Refetches on focus/reconnect so edits in Strapi appear without full refresh.
 */
export function ServicePageWithSWR({ slug, initialRawData, Template }: ServicePageWithSWRProps) {
  const { data: rawData } = useSWR(
    `/api/cms/services/${slug}`,
    fetcher,
    {
      fallbackData: initialRawData,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  const data = transformServiceData(slug, (rawData || initialRawData) as any);

  return <Template data={data} />;
}
