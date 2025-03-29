import { create } from "zustand";
import { persist } from "zustand/middleware";


export type Rating = { value: string; source: string };
export type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster?: string;
  Rating?: Rating;
};
export type OMDBResponse = {
  Response: string;
  Search: Movie[];
  Error?: string;
};

interface MovieStore {
  movies: Movie[];
  loading: boolean;
  error: string;
  setMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearMovies: () => void;
}

export const useMovieStore = create<MovieStore>()(persist((set) => ({
  movies: [],
  loading: false,
  error: '',
  setMovies: (movies: Movie[]) => set({ movies }),  // Directly update movies
  setLoading: (loading: boolean) => set({ loading }),  // Directly update loading state
  setError: (error: string) => set({ error }),  // Directly update error state
  clearMovies: () => set({ movies: [], error: '', loading: false }),  // Reset all states
}),{name :"result-storage"}));
