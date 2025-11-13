"use client";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ color: "#666", marginTop: 6 }}>{subtitle}</p>}
    </header>
  );
}
