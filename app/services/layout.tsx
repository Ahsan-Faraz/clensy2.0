import React from "react";
import CMSAdapter from "@/lib/cms-adapter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const revalidate = 300;

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, locations] = await Promise.all([
    CMSAdapter.getAllServices({ revalidate: 300 }),
    CMSAdapter.getAllLocations({ revalidate: 300 }),
  ]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar services={services} locations={locations} />
      {children}
      <Footer services={services} locations={locations} />
    </div>
  );
}
