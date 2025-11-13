import styles from "@/styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* === KẾT NỐI FUTA === */}
      <section className={styles.connect}>
        <h2>KẾT NỐI FUTA GROUP</h2>
        <p>
          Kết nối hệ sinh thái FUTA Group qua App FUTA: mua vé xe, xe buýt, xe hợp đồng, giao hàng,...
        </p>
        <div className={styles.apps}>
          <img src="/foot1.svg" alt="App FUTA" />
        </div>
      </section>

      {/* === THÔNG TIN LIÊN HỆ === */}
      <section className={styles.info}>
        <div className={styles.contact}>
          <h3>TRUNG TÂM TỔNG ĐÀI & CSKH</h3>
          <p className={styles.hotline}>1900 6067</p>
          <p>
            CÔNG TY CỔ PHẦN XE KHÁCH PHƯƠNG TRANG - FUTA BUS LINES
            <br />
            Địa chỉ: 486-486A Lê Văn Lương, P. Tân Hưng, Q.7, TP.HCM
            <br />
            Email: hotro@futa.vn | ĐT: 02838386852 | Fax: 02838386853
          </p>
        </div>

        <div className={styles.links}>
          <div>
            <h4>FUTA Bus Lines</h4>
            <ul>
              <li>Về chúng tôi</li>
              <li>Lịch trình</li>
              <li>Tuyến đường</li>
              <li>Tin tức & Sự kiện</li>
            </ul>
          </div>

          <div>
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Tra cứu thông tin đặt vé</li>
              <li>Điều khoản sử dụng</li>
              <li>Câu hỏi thường gặp</li>
              <li>Hướng dẫn đặt vé</li>
            </ul>
          </div>
        </div>
      </section>

      {/* === ĐỐI TÁC === */}
      <section className={styles.partners}>
        <img src="/foot6.svg" alt="FUTA" />
        <img src="/foot5.svg" alt="FUTA Express" />
        <img src="/foot7.svg" alt="FUTA Advertising" />
        <img src="/foot8.png" alt="Phúc Lộc Rest Stop" />
      </section>

      <div className={styles.bottom}>
        <p>© 2025 | Bản quyền thuộc về Công ty Cổ phần Xe khách Phương Trang - FUTA Bus Lines</p>
      </div>
    </footer>
  );
}
