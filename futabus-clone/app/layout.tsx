import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Import CSS cho Leaflet

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./auth/AuthProvider";

// Metadata cho toàn bộ trang web, tốt cho SEO
export const metadata: Metadata = {
  title: "FUTA Bus Lines | Chất lượng là danh dự",
  description:
    "Trang web đặt vé xe FUTA Bus Lines - Phương Trang. Đặt vé trực tuyến, chọn ghế, thanh toán tiện lợi.",
  icons: { icon: "/favicon.ico" },
};

// Đây là RootLayout (layout gốc) áp dụng cho tất cả các trang
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          backgroundColor: "#fff",
          margin: 0,
          fontFamily: "'Roboto', Arial, sans-serif",
          color: "#333",
        }}
      >
        {/* Bọc toàn bộ app trong AuthProvider để các component con (như Navbar) 
          có thể truy cập thông tin session/user.
        */}
        <AuthProvider>
          <Navbar />

          <main
            style={{
              minHeight: "80vh", // Đảm bảo main có chiều cao tối thiểu
              width: "100%",
              margin: "0 auto",
              backgroundColor: "#fff",
            }}
          >
            {/* {children} ở đây chính là nội dung của các file page.tsx */}
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}