'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useMovieStore } from '@/store/movieStore';
import FloatingFavList from './FloatingFavList';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import FeaturedCarousel from './FeaturedCarousel';
import { FaUserCircle } from 'react-icons/fa';
import { useSearchStore } from '@/store/searchStore';

const MovieSearchPage: React.FC = () => {
  const { name ,email, logout, accessToken, favItems } = useUserStore();
  const {setSearch} = useSearchStore();
  const { movies, setMovies,clearMovies } = useMovieStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Handle logout
  const handleLogout = async () => {
    logout().then(() => router.push('/login'));
    clearMovies();
    setSearch('','movie','','')
  };

  // Handle search
  const handleSearch = async (data: { query: string; type: string; startYear?: string; endYear?: string }) => {
    setLoading(true);
    setError('');
    setMovies([]);

    try {
      let url = `/api/movies?query=${data.query}&type=${data.type}`;
      if (data.startYear && data.endYear) url += `&startYear=${data.startYear}&endYear=${data.endYear}`;

      const response = await fetch(url, { credentials: 'include' });

      if (response.status === 401) {
        router.push('/login'); // Redirect if unauthorized
        return;
      }

      const result = await response.json();
      if (result?.length > 0) {
        setMovies(result);
      } else {
        setError('No results found for the given criteria');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* User Info Card */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mx-auto mt-6 max-w-2xl">
        <div className="flex items-center space-x-4">
          <FaUserCircle className="text-3xl text-gray-700" />
          {email ? (
            <div>
              <p className="text-lg font-semibold">Welcome, <span className="text-blue-600">{name}</span></p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-red-500">Not Logged In</p>
              <p className="text-sm text-gray-500">Please log in to access favorites</p>
            </div>
          )}
        </div>
        
        {email ? (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-6 max-w-4xl mx-auto px-4">
        <FeaturedCarousel />
        <SearchBar onSearch={handleSearch} />
        <SearchResult movies={movies} loading={loading} error={error} />
      </div>

      {/* Floating Favorite List */}
      <FloatingFavList items={favItems || []} />
    </div>
  );
};

export default MovieSearchPage;
