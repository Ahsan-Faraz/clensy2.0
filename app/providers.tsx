"use client";

import React from "react";

// For now, skip SessionProvider to avoid React 19 compatibility issues
// The editor page doesn't need authentication anyway
// TODO: Re-enable when next-auth is compatible with React 19
export default function Providers({ children }: { children: React.ReactNode }) {
  // Temporarily bypass SessionProvider due to React 19 compatibility issues
  // Uncomment below when next-auth is updated for React 19 compatibility
  // import { SessionProvider } from "next-auth/react";
  // return <SessionProvider>{children}</SessionProvider>;
  
  return <>{children}</>;
}