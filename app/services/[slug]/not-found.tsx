import Link from "next/link";

export default function ServiceNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
      <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
      <p className="text-gray-600 mb-8">
        The requested service could not be found.
      </p>
      <Link
        href="/services"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-colors"
      >
        View All Services
      </Link>
    </div>
  );
}
