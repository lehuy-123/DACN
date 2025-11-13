"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./News.module.css";

type Category =
  | "Tin tức tổng hợp"
  | "FUTA Bus Lines"
  | "FUTA City Bus"
  | "Khuyến mãi"
  | "Giải thưởng"
  | "Trạm dừng";

interface NewsItem {
  id: number;
  title: string;
  desc: string;        // mô tả ngắn
  date: string;        // dd/MM/yyyy
  time: string;        // HH:mm
  img: string;         // /public/...
  category: Category;
  featured?: boolean;  // dùng cho “Tin tức nổi bật”
}

const TABS: Category[] = [
  "Tin tức tổng hợp",
  "FUTA Bus Lines",
  "FUTA City Bus",
  "Khuyến mãi",
  "Giải thưởng",
  "Trạm dừng",
];

// ===== Mock data (cứng) =====
const NEWS_SEED: NewsItem[] = [
  {
    id: 1,
    title: "ĐẶT VÉ FUTA ONLINE, KHỞI HÀNH NGAY – DEAL HỜI TRONG TẦY",
    desc:
      "Không cần ra bến, không lo chờ đợi – chỉ vài thao tác trên App FUTA hoặc Website futabus.vn.",
    date: "15/09/2025",
    time: "08:30",
    img: "/news1.jpg",
    category: "Khuyến mãi",
    featured: true,
  },
  {
    id: 2,
    title: "TRẢI NGHIỆM DỊCH VỤ TRUNG CHUYỂN ĐÓN TRẢ TẬN NƠI",
    desc:
      "Dịch vụ trung chuyển miễn phí từ Bến xe Miền Đông mới đến tận nhà – tối ưu thời gian di chuyển.",
    date: "06/06/2025",
    time: "15:47",
    img: "/news2.jpg",
    category: "FUTA Bus Lines",
    featured: true,
  },
  {
    id: 3,
    title: "THANH TOÁN FUTA VỚI SHOPEEPAY – ƯU ĐÃI 20%",
    desc: "Giảm ngay 20% khi thanh toán vé xe Phương Trang bằng ShopeePay.",
    date: "10/10/2025",
    time: "14:21",
    img: "/news3.jpg",
    category: "Khuyến mãi",
    featured: true,
  },
  {
    id: 4,
    title: "KHAI TRƯƠNG VĂN PHÒNG BỆNH VIỆN UNG BƯỚU 2",
    desc:
      "Phương Trang mở thêm văn phòng phục vụ khách hàng tại Bệnh viện Ung Bướu 2 – thuận tiện hơn cho việc mua vé & trung chuyển.",
    date: "28/10/2025",
    time: "13:36",
    img: "/news4.jpg",
    category: "FUTA Bus Lines",
  },
  {
    id: 5,
    title: "CÓ MẶT TẠI BỆNH VIỆN UNG BƯỚU CƠ SỞ 1",
    desc:
      "Tiếp tục mở rộng mạng lưới trung chuyển phục vụ tận nơi, chăm sóc hành khách tốt hơn.",
    date: "28/10/2025",
    time: "11:08",
    img: "/news5.jpg",
    category: "FUTA Bus Lines",
  },
  {
    id: 6,
    title: "MỪNG ĐẠI LỄ 2/9 – ĐI XE BUÝT MIỄN PHÍ TOÀN THÀNH PHỐ",
    desc:
      "FUTA City Bus triển khai miễn phí toàn tuyến trong ngày lễ – tri ân hành khách.",
    date: "02/09/2025",
    time: "08:00",
    img: "/news6.jpg",
    category: "FUTA City Bus",
  },
  {
    id: 7,
    title:
      "THÔNG BÁO THAY ĐỔI DÒNG XE – CẬP NHẬT GIÁ VÉ TUYẾN BẾN XE MIỀN TÂY",
    desc:
      "Nâng cấp xe giường nằm 5 sao, trải nghiệm thoải mái và hiện đại hơn.",
    date: "25/08/2025",
    time: "10:15",
    img: "/news7.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 8,
    title: "TOP 5 GIẢI THƯỞNG DỊCH VỤ VẬN TẢI 2025",
    desc:
      "FUTA Bus Lines tiếp tục góp mặt trong danh sách các dịch vụ vận tải được yêu thích.",
    date: "05/08/2025",
    time: "09:10",
    img: "/news8.jpg",
    category: "Giải thưởng",
  },
  {
    id: 9,
    title: "MỞ RỘNG TRẠM DỪNG TIỆN ÍCH TẠI LONG AN",
    desc:
      "Bổ sung khu F&B, phòng vệ sinh và khu vực nghỉ ngơi sạch sẽ cho hành khách.",
    date: "21/07/2025",
    time: "16:22",
    img: "/news9.jpg",
    category: "Trạm dừng",
  },
  {
    id: 10,
    title: "TUYẾN BUÝT MỚI TẠI TP.HCM – HỖ TRỢ LIÊN KẾT BẾN XE",
    desc:
      "Thêm các tuyến kết nối trọng điểm, thuận tiện trung chuyển đến bến xe.",
    date: "10/07/2025",
    time: "07:30",
    img: "/news10.jpg",
    category: "FUTA City Bus",
  },
  {
    id: 11,
    title: "THÔNG BÁO BẢO TRÌ HỆ THỐNG ĐẶT VÉ TRONG ĐÊM",
    desc: "Hệ thống đặt vé bảo trì từ 00:30–02:00 để nâng cấp hiệu năng, mong quý khách thông cảm.",
    date: "18/10/2025",
    time: "23:45",
    img: "/news11.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 12,
    title: "CẬP NHẬT THỜI GIAN MỞ CỬA QUẦY VÉ TẠI MỘT SỐ BẾN",
    desc: "Điều chỉnh khung giờ phục vụ tại một số bến nhằm đáp ứng lưu lượng hành khách giờ cao điểm.",
    date: "12/10/2025",
    time: "08:10",
    img: "/news12.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 13,
    title: "TĂNG CƯỜNG NHÂN SỰ HỖ TRỢ KHÁCH HÀNG TRONG MÙA LỄ",
    desc: "Bổ sung nhân sự tại bến và tổng đài để rút ngắn thời gian chờ của khách hàng.",
    date: "05/10/2025",
    time: "14:05",
    img: "/news13.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 14,
    title: "HƯỚNG DẪN XUẤT HÓA ĐƠN ĐIỆN TỬ KHI MUA VÉ TRỰC TUYẾN",
    desc: "Quý khách có thể xuất hóa đơn ngay trong mục Lịch sử đặt vé – thao tác nhanh trong 1 phút.",
    date: "30/09/2025",
    time: "09:20",
    img: "/news14.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 15,
    title: "TỐI ƯU LỘ TRÌNH XE TRONG THÀNH PHỐ – GIẢM THỜI GIAN DI CHUYỂN",
    desc: "Một số chuyến nội tỉnh được tối ưu lộ trình nhằm tăng tính kết nối giữa các bến.",
    date: "22/09/2025",
    time: "16:30",
    img: "/news15.jpg",
    category: "Tin tức tổng hợp",
  },
  {
    id: 16,
    title: "MỞ THÊM KÊNH THANH TOÁN THẺ NGÂN HÀNG QUỐC TẾ",
    desc: "Chấp nhận thẻ Visa/Master/JCB trên website/app để thuận tiện cho du khách.",
    date: "18/09/2025",
    time: "11:55",
    img: "/news16.jpg",
    category: "Tin tức tổng hợp",
  },
];

function getPageNumbers(total: number, current: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function NewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Category>("Tin tức tổng hợp");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState<number>(1);

  // danh sách tin dùng state để có thể append khi thêm
  const [news, setNews] = useState<NewsItem[]>(NEWS_SEED);

  // Đồng bộ ?page= trên URL
  useEffect(() => {
    const p = Number(searchParams.get("page") || 1);
    setPage(Number.isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  // Danh sách “nổi bật” (3 item có featured)
  const highlights = useMemo(
    () => news.filter((n) => n.featured).slice(0, 3),
    [news]
  );

  // Lọc theo Tab + tìm kiếm
  const filtered = useMemo(() => {
    const byTab = news.filter((n) => n.category === activeTab);
    const q = query.trim().toLowerCase();
    return q
      ? byTab.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.desc.toLowerCase().includes(q)
        )
      : byTab;
  }, [news, activeTab, query]);

  // Phân trang – TRANG 1 CỐ ĐỊNH 4 BÀI
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goPage = useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), totalPages);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(next));
      router.push(`?${params.toString()}`, { scroll: true });
    },
    [router, searchParams, totalPages]
  );

  // Reset về trang 1 khi đổi tab hoặc đổi từ khóa
  useEffect(() => {
    goPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, query]);

  // === Thêm bài mới: luôn append, giữ nguyên 4 bài ở trang 1; tự sang trang chứa bài mới ===
  const addNews = useCallback(
    (item: NewsItem) => {
      setNews((prev) => [...prev, item]); // append cuối mảng

      // Tính số lượng của tab hiện tại sau khi thêm (nếu item thuộc tab đang xem & match keyword)
      const matchesActiveTab = item.category === activeTab;
      const matchesQuery =
        (item.title + item.desc).toLowerCase().includes(query.toLowerCase());
      const delta = matchesActiveTab && matchesQuery ? 1 : 0;

      const nextCount = filtered.length + delta;
      const nextTotalPages = Math.max(1, Math.ceil(nextCount / pageSize));

      // Nếu có từ 2 trang trở lên, nhảy sang trang cuối (lần đầu chính là trang 2)
      if (nextTotalPages >= 2) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(nextTotalPages));
        router.push(`?${params.toString()}`, { scroll: true });
      }
    },
    [activeTab, query, filtered.length, pageSize, router, searchParams]
  );

  return (
    <div className={styles.wrapper}>
      {/* Tabs + Search */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm tin tức"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Nút demo thêm bài mới (ẩn ở production nếu không muốn) */}
        {process.env.NODE_ENV !== "production" && (
          <button
            style={{ marginLeft: 12 }}
            className={styles.pageButton}
            onClick={() =>
              addNews({
                id: Date.now(),
                title: "BẢN TIN MỚI THÊM (demo)",
                desc:
                  "Nội dung demo – khi trang 1 đủ 4 bài, bài mới sẽ nằm ở trang 2 trở đi.",
                date: "01/11/2025",
                time: "09:00",
                img: "/news11.jpg",
                category: activeTab,
              })
            }
          >
            + Thêm bài (demo)
          </button>
        )}
      </div>

      {/* Tin tức nổi bật */}
      <h2 className={styles.sectionTitle}>Tin tức nổi bật</h2>
      <div className={styles.highlightGrid}>
        {highlights.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.img} alt={item.title} className={styles.image} />
            <div className={styles.content}>
              <p className={styles.time}>
                {item.time} {item.date}
              </p>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tất cả tin tức */}
      <h2 className={styles.sectionTitleGreen}>Tất cả tin tức</h2>
      <div className={styles.allGrid}>
        {pageData.map((item) => (
          <article key={item.id} className={styles.allCard}>
            <img src={item.img} alt={item.title} className={styles.thumb} />
            <div className={styles.allContent}>
              <h4 className={styles.title}>{item.title}</h4>
              <p className={styles.desc}>{item.desc}</p>
              <p className={styles.time}>
                {item.time} {item.date}
              </p>
            </div>
          </article>
        ))}
        {pageData.length === 0 && (
          <div className={styles.empty}>Không có tin phù hợp.</div>
        )}
      </div>

      {/* Pagination giống FUTA (1 … c-1 c c+1 … N) */}
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => goPage(safePage - 1)}
          disabled={safePage === 1}
          aria-label="Trang trước"
        >
          «
        </button>

        {getPageNumbers(totalPages, safePage).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goPage(p as number)}
              className={`${styles.pageButton} ${
                safePage === p ? styles.pageActive : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.pageButton}
          onClick={() => goPage(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label="Trang sau"
        >
          »
        </button>
      </div>
    </div>
  );
}

