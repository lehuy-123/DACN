'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Banner from '../components/Banner';
import SearchForm from '../components/SearchForm';
import styles from './search.module.css';

interface Trip {
  id: number;
  startTime: string;     // "HH:MM"
  endTime: string;       // "HH:MM"
  from: string;
  to: string;
  startLocation: string; // tên VP/bến xe
  endLocation: string;   // tên VP/bến xe
  duration: string;      // "3 giờ"
  vehicleInfo: string;   // "(Asanzo/Hồ Chí Minh)"
  type: string;          // "Ghế" | "Giường" | "Limousine"
  price: number;         // VND
  availableSeats: number;
}

type SortKey = 'price' | 'time' | 'seats' | null;

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromQuery = searchParams.get('from');
  const toQuery = searchParams.get('to');
  const dateQuery = searchParams.get('date');
  const ticketCount = searchParams.get('tickets');

  // Danh sách gốc & đã lọc
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);

  // Sắp xếp
  const [sortKey, setSortKey] = useState<SortKey>('price');

  // Đếm theo giờ
  const timeCounts = useMemo(() => {
    const counts = { sangsom: 0, buoisang: 0, buoichieu: 0, buoitoi: 0 };
    allTrips.forEach((trip) => {
      const hour = parseInt(trip.startTime.split(':')[0], 10);
      if (hour >= 0 && hour < 6) counts.sangsom++;
      else if (hour >= 6 && hour < 12) counts.buoisang++;
      else if (hour >= 12 && hour < 18) counts.buoichieu++;
      else if (hour >= 18 && hour < 24) counts.buoitoi++;
    });
    return counts;
  }, [allTrips]);

  // Đếm theo loại xe
  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allTrips.forEach((trip) => {
      counts.set(trip.type, (counts.get(trip.type) || 0) + 1);
    });
    return counts;
  }, [allTrips]);

  // === Fetch dữ liệu (dùng fallback) ===
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        // NOTE: tắt API thật, dùng dữ liệu giả định
        throw new Error('BE chưa sẵn sàng, dùng data mẫu');
      } catch (err: any) {
        console.error(err);
        const fallbackFrom = fromQuery || 'TP. Hồ Chí Minh';
        const fallbackTo = toQuery || 'Bà Rịa - Vũng Tàu';
        const fallbackData: Trip[] = [
          {
            id: 1,
            from: fallbackFrom,
            to: fallbackTo,
            startTime: '05:30',
            endTime: '09:30',
            startLocation: 'Bến Xe Miền Tây',
            endLocation: 'VP Bến Xe Vũng Tàu',
            duration: '3 giờ',
            vehicleInfo: '(Asanzo/Hồ Chí Minh)',
            type: 'Ghế',
            price: 140000,
            availableSeats: 28
          },
          {
            id: 2,
            from: fallbackFrom,
            to: fallbackTo,
            startTime: '07:30',
            endTime: '10:30',
            startLocation: 'Bến Xe Miền Tây',
            endLocation: 'VP Bến Xe Vũng Tàu',
            duration: '3 giờ',
            vehicleInfo: '(Asanzo/Hồ Chí Minh)',
            type: 'Ghế',
            price: 140000,
            availableSeats: 27
          },
          {
            id: 3,
            from: fallbackFrom,
            to: fallbackTo,
            startTime: '08:30',
            endTime: '11:30',
            startLocation: 'Bến Xe Miền Tây',
            endLocation: 'VP Bến Xe Vũng Tàu',
            duration: '3 giờ',
            vehicleInfo: '(Asanzo/Hồ Chí Minh)',
            type: 'Giường',
            price: 180000,
            availableSeats: 27
          },
          {
            id: 4,
            from: fallbackFrom,
            to: fallbackTo,
            startTime: '14:00',
            endTime: '17:00',
            startLocation: 'Bến Xe Miền Tây',
            endLocation: 'VP Bến Xe Vũng Tàu',
            duration: '3 giờ',
            vehicleInfo: '(Asanzo/Hồ Chí Minh)',
            type: 'Ghế',
            price: 140000,
            availableSeats: 24
          },
          {
            id: 5,
            from: fallbackFrom,
            to: fallbackTo,
            startTime: '20:00',
            endTime: '23:00',
            startLocation: 'Bến Xe Miền Tây',
            endLocation: 'VP Bến Xe Vũng Tàu',
            duration: '3 giờ',
            vehicleInfo: '(Asanzo/Hồ Chí Minh)',
            type: 'Limousine',
            price: 220000,
            availableSeats: 15
          }
        ];
        setAllTrips(fallbackData);
        setError('Đang hiển thị dữ liệu mẫu.');
      } finally {
        setLoading(false);
      }
    };

    if (fromQuery && toQuery && dateQuery) {
      fetchTrips();
    } else {
      setLoading(false);
      setAllTrips([]);
      setFilteredTrips([]);
      setError('Vui lòng tìm kiếm chuyến đi.');
    }
  }, [fromQuery, toQuery, dateQuery]);

  // Lọc + Sort mỗi khi allTrips hoặc filter/sort thay đổi
  useEffect(() => {
    let temp = [...allTrips];

    // 1) Lọc theo khoảng giờ
    if (selectedTimes.length > 0) {
      temp = temp.filter((trip) => {
        const hour = parseInt(trip.startTime.split(':')[0], 10);
        return selectedTimes.some((key) => {
          if (key === 'sangsom') return hour >= 0 && hour < 6;
          if (key === 'buoisang') return hour >= 6 && hour < 12;
          if (key === 'buoichieu') return hour >= 12 && hour < 18;
          if (key === 'buoitoi') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    // 2) Lọc theo loại xe
    if (selectedTypes.length > 0) {
      temp = temp.filter((trip) => selectedTypes.includes(trip.type));
    }

    // 3) (Tuỳ chọn) Lọc theo hạng ghế (chưa có dữ liệu thật)
    if (selectedClasses.length > 0) {
      // temp = temp.filter(...)
    }

    // 4) (Tuỳ chọn) Lọc theo tầng (chưa có dữ liệu thật)
    if (selectedDecks.length > 0) {
      // temp = temp.filter(...)
    }

    // 5) Sort
    if (sortKey === 'price') {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortKey === 'time') {
      temp.sort(
        (a, b) =>
          parseInt(a.startTime.replace(':', ''), 10) -
          parseInt(b.startTime.replace(':', ''), 10)
      );
    } else if (sortKey === 'seats') {
      temp.sort((a, b) => b.availableSeats - a.availableSeats);
    }

    setFilteredTrips(temp);
  }, [
    allTrips,
    selectedTimes,
    selectedTypes,
    selectedClasses,
    selectedDecks,
    sortKey
  ]);

  // Chọn chuyến → chuyển trang (tuỳ bạn thay URL)
  const handleSelectTrip = (trip: Trip) => {
    const params = new URLSearchParams({
      from: trip.from,
      to: trip.to,
      date: dateQuery || '',
      startTime: trip.startTime,
      endTime: trip.endTime,
      type: trip.type,
      price: String(trip.price),
      seats: String(trip.availableSeats),
      tickets: ticketCount || '1'
    });
    
    router.push(`/select-seat?${params.toString()}`);
  };

  // Bộ lọc giờ
  const handleTimeFilterChange = (timeKey: string) => {
    setSelectedTimes((prev) =>
      prev.includes(timeKey) ? prev.filter((t) => t !== timeKey) : [...prev, timeKey]
    );
  };

  // Toggle tag filter generic
  const handleTagFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Bỏ lọc
  const handleClearFilters = () => {
    setSelectedTimes([]);
    setSelectedTypes([]);
    setSelectedClasses([]);
    setSelectedDecks([]);
  };

  // Chuyển sort
  const applySort = (key: SortKey) => setSortKey(key);

  const fromLabel = fromQuery || 'TP. Hồ Chí Minh';
  const toLabel = toQuery || 'Bà Rịa - Vũng Tàu';

  return (
    <>
      {/* Header (banner + form) */}
      <div className={styles.headerSection}>
        <Banner />
        <SearchForm />
      </div>

      <div className={styles.container}>
        {/* SIDEBAR FILTERS */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>BỘ LỌC TÌM KIẾM</h3>
            <button onClick={handleClearFilters} className={styles.clearButton}>
              Bỏ lọc 🗑️
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label>Giờ đi</label>
            <div className={styles.checkboxList}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTimes.includes('sangsom')}
                  onChange={() => handleTimeFilterChange('sangsom')}
                />
                {' '}Sáng sớm 00:00 - 06:00 ({timeCounts.sangsom})
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTimes.includes('buoisang')}
                  onChange={() => handleTimeFilterChange('buoisang')}
                />
                {' '}Buổi sáng 06:00 - 12:00 ({timeCounts.buoisang})
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTimes.includes('buoichieu')}
                  onChange={() => handleTimeFilterChange('buoichieu')}
                />
                {' '}Buổi chiều 12:00 - 18:00 ({timeCounts.buoichieu})
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedTimes.includes('buoitoi')}
                  onChange={() => handleTimeFilterChange('buoitoi')}
                />
                {' '}Buổi tối 18:00 - 24:00 ({timeCounts.buoitoi})
              </label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Loại xe</label>
            <div className={styles.tags}>
              <span
                role="button"
                tabIndex={0}
                className={selectedTypes.includes('Ghế') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedTypes, 'Ghế')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedTypes, 'Ghế')}
              >
                Ghế ({typeCounts.get('Ghế') || 0})
              </span>

              <span
                role="button"
                tabIndex={0}
                className={selectedTypes.includes('Giường') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedTypes, 'Giường')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedTypes, 'Giường')}
              >
                Giường ({typeCounts.get('Giường') || 0})
              </span>

              <span
                role="button"
                tabIndex={0}
                className={selectedTypes.includes('Limousine') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedTypes, 'Limousine')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedTypes, 'Limousine')}
              >
                Limousine ({typeCounts.get('Limousine') || 0})
              </span>
            </div>
          </div>

          {/* Hai bộ lọc “hạng ghế” & “tầng” – demo tag toggle */}
          <div className={styles.filterGroup}>
            <label>Hạng ghế</label>
            <div className={styles.tags}>
              <span
                role="button"
                tabIndex={0}
                className={selectedClasses.includes('Hàng đầu') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedClasses, 'Hàng đầu')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedClasses, 'Hàng đầu')}
              >
                Hàng đầu
              </span>
              <span
                role="button"
                tabIndex={0}
                className={selectedClasses.includes('Hàng giữa') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedClasses, 'Hàng giữa')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedClasses, 'Hàng giữa')}
              >
                Hàng giữa
              </span>
              <span
                role="button"
                tabIndex={0}
                className={selectedClasses.includes('Hàng cuối') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedClasses, 'Hàng cuối')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedClasses, 'Hàng cuối')}
              >
                Hàng cuối
              </span>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Tầng</label>
            <div className={styles.tags}>
              <span
                role="button"
                tabIndex={0}
                className={selectedDecks.includes('Tầng trên') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedDecks, 'Tầng trên')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedDecks, 'Tầng trên')}
              >
                Tầng trên
              </span>
              <span
                role="button"
                tabIndex={0}
                className={selectedDecks.includes('Tầng dưới') ? styles.tagActive : styles.tag}
                onClick={() => handleTagFilterChange(setSelectedDecks, 'Tầng dưới')}
                onKeyDown={(e) => e.key === 'Enter' && handleTagFilterChange(setSelectedDecks, 'Tầng dưới')}
              >
                Tầng dưới
              </span>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <main className={styles.results}>
          <h2>
            {fromLabel} - {toLabel} ({filteredTrips.length})
          </h2>

          <div className={styles.options}>
            <button
              className={sortKey === 'price' ? styles.optionActive : ''}
              onClick={() => applySort('price')}
            >
              💸 Giá rẻ bất ngờ
            </button>
            <button
              className={sortKey === 'time' ? styles.optionActive : ''}
              onClick={() => applySort('time')}
            >
              🕓 Giờ khởi hành
            </button>
            <button
              className={sortKey === 'seats' ? styles.optionActive : ''}
              onClick={() => applySort('seats')}
            >
              💺 Ghế trống
            </button>
          </div>

          {loading ? (
            <p className={styles.loading}>Đang tải chuyến xe...</p>
          ) : filteredTrips.length === 0 ? (
            <div className={styles.noResult}>
              <img src="/no-result.svg" alt="No result" />
              <p>Không có kết quả được tìm thấy.</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip.id} className={styles.tripCard}>
                {/* Cột trái: thời gian */}
                <div className={styles.tripTime}>
                  <div className={styles.timeRow}>
                    <span className={styles.time}>{trip.startTime}</span>
                    <span className={styles.dot}></span>
                    <span className={styles.time}>{trip.endTime}</span>
                  </div>
                  <div className={styles.duration}>{trip.duration}</div>
                </div>

                {/* Cột giữa: thông tin tuyến/điểm đón-trả */}
                <div className={styles.tripInfo}>
                  <div className={styles.routeLine}>
                    <span className={styles.cityFrom}>{trip.from}</span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.cityTo}>{trip.to}</span>
                  </div>
                  <div className={styles.locations}>
                    <div className={styles.location}>
                      <label>Điểm đón:</label>
                      <span>{trip.startLocation}</span>
                    </div>
                    <div className={styles.location}>
                      <label>Điểm trả:</label>
                      <span>{trip.endLocation}</span>
                    </div>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.type}>{trip.type}</span>
                    <span className={styles.vehicleInfo}>{trip.vehicleInfo}</span>
                  </div>
                </div>

                {/* Cột phải: giá – ghế trống – nút */}
                <div className={styles.tripAction}>
                  <div className={styles.price}>
                    {trip.price.toLocaleString('vi-VN')}đ
                  </div>
                  <div className={styles.seats}>
                    Còn {trip.availableSeats} ghế
                  </div>
                  <button
                    className={styles.selectBtn}
                    onClick={() => handleSelectTrip(trip)}
                  >
                    Chọn
                  </button>
                </div>
              </div>
            ))
          )}

          {error && (
            <p className={`${styles.error} ${styles.compactError}`}>{error}</p>
          )}
        </main>
      </div>
    </>
  );
}
