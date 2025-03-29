import { create } from "zustand";
import { persist } from "zustand/middleware";


// Define the shape of the store state
interface SearchStore {
  query: string;
  type: 'movie' | 'series'; // Restrict type to movie or series
  startYear: string;
  endYear: string;
  setQuery: (query: string) => void;
  setType: (type: 'movie' | 'series') => void;
  setStartYear: (startYear: string) => void;
  setEndYear: (endYear: string) => void;
  setSearch:(query:string,type:'movie' | 'series',startYear:string,endYear:string,)=>void;
}

// Create the Zustand store with explicit types
export const useSearchStore = create<SearchStore>()(persist((set,get) => ({
  query: '',
  type: 'movie',
  startYear: '',
  endYear: '',
  setQuery: (query: string) => set({ query }),
  setType: (type: 'movie' | 'series') => set({ type }),
  setStartYear: (startYear: string) => set({ startYear }),
  setEndYear: (endYear: string) => set({ endYear }),
  setSearch(query, type, startYear, endYear) {
    set ({query, type, startYear, endYear})
  },
}),{ name: 'search-storage',}));
