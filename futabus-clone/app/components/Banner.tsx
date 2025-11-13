import styles from "@/styles/Banner.module.css";

export default function Banner() {
  return (
    <section className={styles.banner}>
      <img src="/banner.png" alt="FUTA Bus" className={styles.image} />
    </section>
  );
}
