import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Стейт для модалки

  const queryClient = useQueryClient();

  // Настраиваем мутацию для создания нотатки
  const addNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote, // Функция удаления из noteService
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const { data } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () => fetchNotes({ page, perPage: 10, search: searchQuery }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {/* Кнопка открытия модалки */}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {data?.notes && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={(id) => deleteNoteMutation.mutate(id)}
        />
      )}
      {data?.totalPages && data.totalPages > 1 && (
        <Pagination totalPages={data.totalPages} onPageChange={setPage} />
      )}

      {/* Рендерим модалку, если стейт true */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(values) => {
              // Вызываем мутацию и передаем данные из формы
              addNoteMutation.mutate(values as any);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
