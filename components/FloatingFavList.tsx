"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTimes } from "react-icons/fa";

// Define the Movie Type
interface Movie {
  Title: string;
  imdbID: string;
}

const FloatingFavList: React.FC<{ items: string[] }> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch movie details
  useEffect(() => {
    if (items.length === 0) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const fetchedMovies = await Promise.all(
          items.map(async (id) => {
            const res = await fetch(`/api/movie?id=${id}`);
            const data = await res.json();
            return { Title: data.Title, imdbID: id };
          })
        );
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [items]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Toggle Button */}
      <button
        className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaStar size={20} />}
        <span className="ml-2">Your Favorites</span>
      </button>

      {/* Expandable List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="w-72 bg-white shadow-xl rounded-lg mt-3 overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-3 text-center font-semibold">
              Your Favorite List
            </div>
            <div className="p-3 max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <div
                    key={movie.imdbID}
                    className="flex justify-between items-center border-b last:border-none py-2"
                  >
                    <span>{movie.Title}</span>
                    <a className="text-blue-600 font-semibold" href={`/movie/${movie.imdbID}`}>
                      {'see >'}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No favorites yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingFavList;
