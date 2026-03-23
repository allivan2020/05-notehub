import Paginate from 'react-paginate';
import css from './Pagination.module.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPaginateComponent = (Paginate as any).default || Paginate;

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginateComponent
      pageCount={totalPages}
      forcePage={currentPage - 1}
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
