"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/PopularRoutes.module.css";

export default function PopularRoutes() {
  const router = useRouter();

  const routes = [
    {
      from: "Tp Hồ Chí Minh",
      image: "/tuyen1.png",
      trips: [
        { to: "Đà Lạt", distance: "310km", duration: "8 giờ", date: "01/11/2025", price: 290000 },
        { to: "Cần Thơ", distance: "172km", duration: "5 giờ", date: "01/11/2025", price: 165000 },
        { to: "Long Xuyên", distance: "209km", duration: "5 giờ", date: "01/11/2025", price: 200000 },
      ],
    },


    {
      from: "Đà Lạt",
      image: "/tuyen2.png",
      trips: [
        { to: "TP. Hồ Chí Minh", distance: "300km", duration: "8 giờ", date: "01/11/2025", price: 290000 },
        { to: "Đà Nẵng", distance: "700km", duration: "14 giờ", date: "01/11/2025", price: 430000 },
        { to: "Cần Thơ", distance: "464km", duration: "11 giờ", date: "01/11/2025", price: 445000 },
      ],
    },
    {
      from: "Đà Nẵng",
      image: "/tuyen3.png",
      trips: [
        { to: "Đà Lạt", distance: "700km", duration: "14 giờ", date: "01/11/2025", price: 430000 },
        { to: "BX An Sương", distance: "990km", duration: "20 giờ", date: "01/11/2025", price: 495000 },
        { to: "Nha Trang", distance: "550km", duration: "10 giờ", date: "01/11/2025", price: 380000 },
      ],
    },
  ];

  const goToSchedule = (from: string, to: string) => {
    router.push(`/schedule?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>TUYẾN PHỔ BIẾN</h2>
      <p className={styles.sub}>Được khách hàng tin tưởng và lựa chọn</p>

      <div className={styles.container}>
        {routes.map((route, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.imageWrap} onClick={() => goToSchedule(route.from, route.trips[0].to)}>
              <img src={route.image} alt={route.from} className={styles.image} />
              <div className={styles.routeLabel}>Tuyến xe từ {route.from}</div>
            </div>

            <div className={styles.tripList}>
              {route.trips.map((trip, j) => (
                <div
                  key={j}
                  className={styles.tripRow}
                  onClick={() => goToSchedule(route.from, trip.to)}
                >
                  <div>
                    <div className={styles.tripTo}>{trip.to}</div>
                    <div className={styles.tripDetail}>
                      {trip.distance} – {trip.duration} – {trip.date}
                    </div>
                  </div>
                 <div className={styles.tripPrice}>
  {new Intl.NumberFormat("vi-VN").format(trip.price)}đ
</div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
