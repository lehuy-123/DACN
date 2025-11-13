// app/admin/vehicles/[id]/layout.tsx
import React from 'react';
export default function DetailPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {children}
    </div>
  );
}