// app/admin/promotions/[id]/layout.tsx
import React from 'react';

// Layout này đè lên layout (app/admin/layout.tsx)
// và chỉ cung cấp một khung nền trống màu xám nhạt.
export default function DetailPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {children}
    </div>
  );
}