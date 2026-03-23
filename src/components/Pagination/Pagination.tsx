import Paginate from 'react-paginate';
import css from './Pagination.module.css';

// Железобетонная обертка: если Vite спрятал компонент в default, достаем его оттуда
const ReactPaginateComponent = (Paginate as any).default || Paginate;

interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginateComponent
      pageCount={totalPages}
      onPageChange={(event: { selected: number }) =>
        onPageChange(event.selected + 1)
      }
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageLinkClassName={css.link}
      previousClassName={css.previous}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}
