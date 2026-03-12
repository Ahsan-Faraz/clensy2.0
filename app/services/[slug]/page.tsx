"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

import RoutineTemplate from "@/components/service-templates/routine-template";
import DeepTemplate from "@/components/service-templates/deep-template";
import AirbnbTemplate from "@/components/service-templates/airbnb-template";
import MovingTemplate from "@/components/service-templates/moving-template";
import PostConstructionTemplate from "@/components/service-templates/post-construction-template";
import ExtrasTemplate from "@/components/service-templates/extras-template";
import CommercialTemplate from "@/components/service-templates/commercial-template";

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: any }>> = {
  routine: RoutineTemplate,
  deep: DeepTemplate,
  airbnb: AirbnbTemplate,
  moving: MovingTemplate,
  "post-construction": PostConstructionTemplate,
  extras: ExtrasTemplate,
  commercial: CommercialTemplate,
};

export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cms/service/${encodeURIComponent(slug)}`);
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
        console.error("Error fetching service data:", error);
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

  const Template = TEMPLATE_MAP[data.serviceTemplate];

  if (!Template) {
    notFound();
  }

  return <Template data={data} />;
}
