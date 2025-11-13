'use client';
import { FaSearch } from 'react-icons/fa';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import styles from '../admin-ui.module.css';

interface SearchProps {
  placeholder: string;
}

export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    term ? params.set('query', term) : params.delete('query');
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={styles.searchWrapper}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        aria-label="Tìm kiếm"
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}
