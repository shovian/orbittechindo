'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { Movie } from '@/store/movieStore';
const movieVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};


type SearchResultProps = {
  movies: Movie[];
  loading: boolean;
  error: string;
};

const SearchResult: React.FC<SearchResultProps> = ({ movies, loading, error }) => {
  const router = useRouter();
  const { name,
    email,
    phone,
    favItems,
    accessToken, setUser} = useUserStore();

  const toggleFavorite = (imdbID: string) => {


    if (!email) {
      alert('You need to be logged in to add favorites.');
      return;
    }
    const updatedFavorites = favItems?.includes(imdbID)
      ? favItems.filter((id) => id !== imdbID)
      : [...(favItems || []), imdbID];
      const user = {name:name||'',
        email:email||'',
        phone:phone||'',
        favItems:updatedFavorites,
        accessToken:accessToken||''}
        setUser(user)
    
    // setUser(email, updatedFavorites);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {loading ? (
        <p className="text-center">Searching...</p>
      ) : (
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.imdbID}
              variants={movieVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/movie/${movie.imdbID}`)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-center">{movie.Title}</h3>
                <p className="text-sm text-center text-gray-500">
                  {movie.Year} - {movie.Type}
                </p>
                {movie.Rating ? (
                  <p className="text-sm text-center text-yellow-500">
                    Rating: {movie.Rating.value} ({movie.Rating.source})
                  </p>
                ) : (
                  <p className="text-sm text-center text-gray-500">Unrated</p>
                )}

                {/* Favorite Button */}
                <motion.button
                  className={`mt-2 w-full px-4 py-2 text-sm font-medium rounded-md transition ${
                    favItems?.includes(movie.imdbID)
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering movie click
                    toggleFavorite(movie.imdbID);
                  }}
                >
                  {favItems?.includes(movie.imdbID) ? "❤️ Remove Favorite" : "🤍 Add to Favorites"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchResult;
