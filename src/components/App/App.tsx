import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const { data } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () => fetchNotes({ page, perPage: 10, search: searchQuery }),
    placeholderData: keepPreviousData, // Плавная пагинация без мерцания
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data?.totalPages && data.totalPages > 1 && (
        <Pagination
          totalPages={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
