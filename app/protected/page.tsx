"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Authentication is temporarily disabled due to React 19 / Next.js 16 compatibility.
 * NextAuth v4 is not compatible with React 19.
 * This page now provides direct access to admin features.
 */
export default function LoginPage() {
  const router = useRouter();

  // Auto-redirect to editor after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/editor?type=landing-page");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="https://res.cloudinary.com/dgjmm3usy/image/upload/v1750069431/website-images/x50aedpsjrpfubhn0d8b.png" 
              alt="Clensy Logo" 
              width={140} 
              height={50} 
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
          <p className="text-gray-600 mb-4">Authentication temporarily disabled for React 19 compatibility</p>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-md text-left">
            <p className="text-sm text-blue-700 mb-2">
              <strong>Note:</strong> NextAuth v4 is not compatible with React 19/Next.js 16.
            </p>
            <p className="text-sm text-blue-600">
              You will be redirected to the Page Builder automatically...
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/editor?type=landing-page"
              className="block w-full py-2 px-4 rounded-md text-white font-medium bg-[#007bff] hover:bg-[#0069d9] transition-colors text-center"
            >
              Open Page Builder
            </a>
            
            <a
              href="/"
              className="block w-full py-2 px-4 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors text-center"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}