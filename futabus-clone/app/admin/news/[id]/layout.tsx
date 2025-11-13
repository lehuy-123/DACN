// app/admin/news/[id]/layout.tsx
import React from 'react';

// Layout này sẽ đè lên layout của (dashboard)
export default function DetailPageLayout({ children }: { children: React.ReactNode }) {
  return (
    // Chỉ trả về children trên một nền xám
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {children}
    </div>
  );
}