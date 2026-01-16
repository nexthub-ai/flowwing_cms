'use client';

import { InternalHeader } from '@/components/layout/InternalHeader';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Top Header Bar */}
      <div className="fixed top-0 right-0 left-64 z-40">
        <InternalHeader />
      </div>
      {/* Main content with padding for fixed header */}
      <div className="pt-14">
        {children}
      </div>
    </div>
  );
}
