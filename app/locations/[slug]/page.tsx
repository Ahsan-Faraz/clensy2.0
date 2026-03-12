"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import LocationTemplate from "@/components/service-templates/location-template";

export default function LocationPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cms/location/${encodeURIComponent(slug)}`);
        if (response.status === 404) {
          setNotFoundFlag(true);
          return;
        }
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setNotFoundFlag(true);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setNotFoundFlag(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return <LocationTemplate data={data} slug={slug} />;
}
