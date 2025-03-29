'use client';

import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchStore } from '@/store/searchStore';

// Zod Schema
const schema = z.object({
  query: z.string().min(1, 'Query is required'),
  type: z.enum(["movie", "series"]),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
}).refine(data => {
  if ((data.startYear && !data.endYear) || (!data.startYear && data.endYear)) {
    return false; // Ensure both are either filled or empty
  }
  return true;
}, {
  message: 'Both start year and end year are required if one is filled',
  path: ['startYear', 'endYear'],
});

type SearchFormInputs = z.infer<typeof schema>;

const SearchBar: React.FC<{ onSearch: (data: SearchFormInputs) => void }> = ({ onSearch }) => {
  const { query, type, startYear, endYear,setSearch} = useSearchStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: { query, type, startYear, endYear },
    mode:'onChange', // Ensure validation only happens on submit
  });

  const handleSearch = (data: SearchFormInputs) => {
    onSearch(data);
    setSearch(data.query,data.type,data.startYear||'',data.endYear||'')
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit(handleSearch)} className="flex flex-wrap items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Search for movies..."
          className="p-2 flex-1 min-w-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('query')}
        />
        {errors.query && <p className="text-red-500">{errors.query.message}</p>}
        
        <select
          className="p-2 flex-1 min-w-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('type')}
        >
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

        <input
          type="number"
          placeholder="Start Year"
          className="p-2 flex-1 min-w-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('startYear')}
        />
        <input
          type="number"
          placeholder="End Year"
          className="p-2 flex-1 min-w-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('endYear')}
        />
        
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Search
        </button>
      </form>

      {/* Display errors */}
      {(errors.startYear || errors.endYear) ? (
        <p className="text-red-500 mt-2">{"You can either fill it or empty both of it"}</p>
      ) : null}
    </div>
  );
};

export default SearchBar;
