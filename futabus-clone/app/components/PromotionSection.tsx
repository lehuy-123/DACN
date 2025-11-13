import styles from "@/styles/PromotionSection.module.css";

export default function PromotionSection() {
  const promos = [
    { img: "/km1.jpg" },
    { img: "/km2.jpg" },
    { img: "/km3.png" },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>KHUYẾN MÃI NỔI BẬT</h2>
      <div className={styles.grid}>
        {promos.map((p, i) => (
          <img key={i} src={p.img} alt="promotion" className={styles.card} />
        ))}
      </div>
    </section>
  );
}
