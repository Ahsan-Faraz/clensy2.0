import Link from "next/link";

export default function LocationNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
        <p className="mb-6">
          The requested location could not be found.
        </p>
        <Link
          href="/locations"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Locations
        </Link>
      </div>
    </div>
  );
}
