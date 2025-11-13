'use client';

import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';
import styles from './profile.module.css';

import Sidebar from '../components/Sidebar';
import SectionHeader from '../components/SectionHeader';

type TabKey = 'futapay' | 'account' | 'orders' | 'addresses' | 'password' | 'logout';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'futapay', label: 'FUTAPay' },
  { key: 'account', label: 'Thông tin tài khoản' },
  { key: 'orders', label: 'Lịch sử mua vé' },
  { key: 'addresses', label: 'Địa chỉ của bạn' },
  { key: 'password', label: 'Đặt lại mật khẩu' },
  { key: 'logout', label: 'Đăng xuất' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const active: TabKey = (search.get('tab') as TabKey) || 'futapay';

  const [showLogout, setShowLogout] = useState(false);

  // --- Avatar state ---
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string>("");

  useEffect(() => { if (!user) router.replace('/auth/login'); }, [user, router]);

  useEffect(() => {
    if (active === 'logout') {
      setShowLogout(true);
      const qs = new URLSearchParams(search.toString());
      qs.set('tab', 'account');
      router.replace(`/profile?${qs.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onChangeTab = (key: TabKey) => {
    const qs = new URLSearchParams(search.toString());
    qs.set('tab', key);
    router.replace(`/profile?${qs.toString()}`);
  };

  /* ---------- Avatar handlers ---------- */
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setAvatarError('Chỉ cho phép JPEG hoặc PNG');
      return;
    }
    if (f.size > 1024 * 1024) {
      setAvatarError('Dung lượng tối đa 1MB');
      return;
    }

    setAvatarError('');
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);

    // TODO (BE): upload
    // const fd = new FormData();
    // fd.append('avatar', f);
    // await fetch('/api/profile/avatar', { method: 'POST', body: fd });
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    setAvatarError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ---------- Sections ---------- */

  const renderFutaPay = () => (
    <div className={`${styles.card} ${styles.walletCard}`}>
      <SectionHeader title="FUTAPay" subtitle="Ví điện tử liên kết" />
      <div className={styles.walletSummary}>
        <div className={styles.walletBalance}>
          <div className={styles.walletLabel}>Số dư ví</div>
          <div className={styles.walletAmount}>0 đ</div>
        </div>
        <button className={styles.primary}>Giao dịch</button>
      </div>

      <div className={styles.filterBar}>
        <input className={styles.input} placeholder="Mã giao dịch" />
        <input className={styles.input} type="date" />
        <select className={styles.select}>
          <option value="">Chọn trạng thái</option>
          <option>Hoàn tất</option>
          <option>Đang xử lý</option>
          <option>Thất bại</option>
        </select>
        <button className={styles.ghost}>Tìm</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Số tiền</th>
              <th>Nội dung</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5}>
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📄</div>
                  <div>Không có dữ liệu</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className={styles.card}>
      <SectionHeader title="Thông tin tài khoản" subtitle="Quản lý thông tin hồ sơ để bảo mật tài khoản" />

      <div className={styles.accountGrid}>
        <div className={styles.avatarBoxLg}>
          {/* input file ẩn hoàn toàn, không hiện “Chọn tệp” */}
          <input
            id="avatar"
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            className={styles.srOnly}
            onChange={onFileChange}
          />

          {/* ảnh xem trước (nếu chưa chọn thì show ảnh mặc định) */}
          <img
            src={avatarPreview || '/avatar.jpg'}
            alt="avatar"
            className={styles.avatarPreview}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          {/* Chỉ 1 nút “Chọn ảnh” dạng label giống futabus */}
          <div className={styles.avatarActions}>
            <label htmlFor="avatar" className={styles.chooseBtn}>Chọn ảnh</label>
            {avatarPreview && (
              <button type="button" className={styles.ghost} onClick={clearAvatar}>Gỡ</button>
            )}
          </div>

          <p className={styles.helpText}>Dung lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG</p>
          {avatarError && <p className={styles.errorText}>{avatarError}</p>}
        </div>

        <div className={styles.accountFormCol}>
          <div className={styles.formRow}>
            <div className={styles.formLabel}>Họ và tên</div>
            <div className={styles.formValue}>
              <input className={styles.input} defaultValue={user?.name || ''} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formLabel}>Số điện thoại</div>
            <div className={styles.formValue}><b>0932930958</b></div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formLabel}>Giới tính</div>
            <div className={styles.formValue}>
              <select className={styles.select}>
                <option value="">—</option>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formLabel}>Email</div>
            <div className={styles.formValue}><b>{user?.email || 'user@example.com'}</b></div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formLabel}>Ngày sinh</div>
            <div className={styles.formValue}><input className={styles.input} type="date" defaultValue="2025-10-31" /></div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formLabel}>Địa chỉ</div>
            <div className={styles.formValue}><input className={styles.input} placeholder="Nhập địa chỉ" /></div>
          </div>

          <div className={styles.formActionsRight}>
            <button className={styles.ghost}>Hủy</button>
            <button className={styles.primary}>Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className={styles.card}>
      <SectionHeader title="Lịch sử mua vé" subtitle="Theo dõi và quản lý quá trình lịch sử mua vé của bạn" />

      <div className={styles.filterBar}>
        <input className={styles.input} placeholder="Nhập Mã vé" />
        <input className={styles.input} placeholder="Select date" type="text" />
        <input className={styles.input} placeholder="Tuyến đường" />
        <select className={styles.select}>
          <option>Trạng thái</option>
          <option>Hoàn tất</option>
          <option>Đang xử lý</option>
          <option>Đã hủy</option>
        </select>
        <button className={styles.ghost}>Tìm</button>
        <button className={styles.primary} onClick={() => router.push('/')} >Đặt vé</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã vé</th>
              <th>Số vé</th>
              <th>Tuyến đường</th>
              <th>Ngày đi</th>
              <th>Số tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['SX5TMZ', '1', 'BX An Sương - Quận 1 - Vũng Tàu', '05:30 31-10-2025', '334.200đ', '—', 'Hết hạn'],
              ['ZZWV7L', '1', 'BX Miền Tây - Quận 1 - Vũng Tàu', '05:30 31-10-2025', '137.200đ', 'GooPay', 'Hủy'],
              ['ILF0H7', '1', 'BX Miền Tây - Quận 1 - Vũng Tàu', '05:30 31-10-2025', '137.200đ', '—', 'Hết hạn'],
              ['XFWFJE', '1', 'BX Miền Tây - Quận 1 - Vũng Tàu', '05:30 31-10-2025', '137.200đ', '—', 'Hết hạn'],
              ['BX1JWY', '1', 'BX Miền Tây - Quận 1 - Vũng Tàu', '05:30 29-10-2025', '137.200đ', '—', 'Hết hạn'],
              ['J3M0WH', '1', 'BX Miền Tây - Quận 1 - Vũng Tàu', '05:30 29-10-2025', '137.200đ', '—', 'Hết hạn'],
            ].map((r, i) => (
              <tr key={i}>
                <td>{r[0]}</td>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>{r[4]}</td>
                <td>{r[5]}</td>
                <td>
                  <span className={`${styles.tag} ${r[6] === 'Hết hạn' ? styles.tagDanger : styles.tagInfo}`}>
                    {r[6]}
                  </span>
                </td>
                <td>
                  {r[6] === 'Hủy' ? (
                    <button className={styles.btnLink}>Hủy</button>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className={styles.card}>
      <SectionHeader title="Địa chỉ của bạn" subtitle="Địa chỉ của bạn sẽ được sử dụng để nhập nhanh điểm đón - trả tận nơi" />
      <div className={styles.actions}>
        <button className={styles.primary}>Thêm địa chỉ mới</button>
      </div>

      <div className={styles.emptyBoard}>
        <div className={styles.emptyIcon}>📍</div>
        <div>Chưa có địa chỉ nào</div>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className={styles.card}>
      <SectionHeader title="Đặt lại mật khẩu" subtitle="Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác" />
      <div className={styles.phoneHeading}>(+84) 0932930958</div>
      <form className={styles.formNarrow}>
        <label>Mật khẩu cũ<input className={styles.input} type="password" placeholder="Nhập mật khẩu cũ" /></label>
        <label>Mật khẩu mới<input className={styles.input} type="password" placeholder="Nhập mật khẩu mới" /></label>
        <label>Xác nhận mật khẩu<input className={styles.input} type="password" placeholder="Nhập lại mật khẩu" /></label>
        <div className={styles.actions}>
          <button type="button" className={styles.ghost}>Hủy</button>
          <button type="submit" className={styles.primary}>Xác nhận</button>
        </div>
      </form>
    </div>
  );

  const renderSection = () => {
    switch (active) {
      case 'futapay': return renderFutaPay();
      case 'account': return renderAccount();
      case 'orders': return renderOrders();
      case 'addresses': return renderAddresses();
      case 'password': return renderPassword();
      default: return renderAccount();
    }
  };

  return (
    <main className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div />
        </div>
      </div>

      <div className={styles.container}>
        <Sidebar tabs={TABS} active={active} onChange={onChangeTab} />
        <section className={styles.content}>{renderSection()}</section>
      </div>

      {showLogout && (
        <>
          <div className={styles.modalBackdrop} onClick={() => setShowLogout(false)} />
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Bạn có chắc chắn muốn đăng xuất?</div>
            <div className={styles.modalActions}>
              <button className={styles.ghost} onClick={() => setShowLogout(false)}>Hủy</button>
              <button
                className={styles.primary}
                onClick={() => { setShowLogout(false); logout(); router.replace('/'); }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
