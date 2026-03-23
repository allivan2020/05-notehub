import axios from 'axios';
import { type Note, type NoteTag } from '../types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: import.meta.env.VITE_NOTEHUB_TOKEN,
  },
});

interface FetchNotesParams {
  search?: string;
  tag?: string;
  page: number;
  perPage: number;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (data: CreateNoteParams) => {
  const response = await api.post<Note>('/notes', data);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};
