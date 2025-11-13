'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import styles from '../admin-ui.module.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={() => replace(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        title="Trang trước"
      >
        <FaArrow
      </button>

      <div className={styles.paginationInfo}>
        Trang {currentPage} / {totalPages || 1}
      </div>

      <button
        className={styles.paginationButton}
        onClick={() => replace(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
        title="Trang sau"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}
