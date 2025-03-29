"use client"; // Client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Rating {
  Source: string;
  Value: string;
}

interface Movie {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  Ratings?: Rating[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  Type?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
}

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`https://www.omdbapi.com/?i=tt0372784&apikey=${process.env.OMDB_API_KEY}`);

        if (!res.ok) throw new Error("Failed to fetch movie");

        const data: Movie = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovie(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [params.id]);

  if (loading) return <p className="text-center text-gray-500">Loading movie details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!movie) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center">{movie.Title}</h1>
      <p className="text-center text-gray-500">{movie.Year} - {movie.Genre}</p>

      {/* Movie Poster */}
      <div className="flex justify-center my-4">
        {movie.Poster && movie.Title && (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            width={300}
            height={450}
            className="rounded-lg shadow-md"
          />
        )}
      </div>

      {/* Movie Details */}
      <div className="mt-4">
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}/10</p>
        <p className="mt-4 text-lg">{movie.Plot}</p>
      </div>
    </div>
  );
}
