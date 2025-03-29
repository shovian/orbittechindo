'use client';

import { useEffect, useState } from 'react';
import MovieChart from '@/components/ChartMovie';
import BackButton from '@/components/ui/BackButton';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

interface Rating {
	Source: string;
	Value: string;
}

interface Movie {
	Title: string;
	Year: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Language: string;
	Country: string;
	Released: string;
	Runtime: string;
	Rated: string;
	Awards: string;
	BoxOffice: string;
	Production: string;
	Website: string;
	Plot: string;
	Poster: string;
	Ratings?: Rating[];
}

export default function MovieDetailPage({ movieId }: { movieId: string }) {
	const [movie, setMovie] = useState<Movie | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { accessToken } = useUserStore();

	// Redirect if already authenticated
	useEffect(() => {
		if (!accessToken) {
			router.replace('/');
		}
	}, []);
	useEffect(() => {
		async function fetchMovie() {
			try {
				const res = await fetch(`/api/movie?id=${movieId}`);
				const data = await res.json();
				setMovie(data);
			} catch (error) {
				console.error('Error fetching movie:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchMovie();
	}, [movieId]);

	if (loading) return <p className="text-center">Loading...</p>;
	if (!movie) return <p className="text-center">Movie not found.</p>;

	// Convert Ratings to Numeric Data for Chart
	const ratingsData =
		movie.Ratings?.map((rating) => ({
			source: rating.Source,
			value: rating.Value.includes('/')
				? (parseFloat(rating.Value.split('/')[0]) /
						parseFloat(rating.Value.split('/')[1])) *
				  100
				: rating.Value.includes('%')
				? parseFloat(rating.Value)
				: parseFloat(rating.Value),
		})) || [];

	return accessToken&&(
		<div className="max-w-3xl mx-auto p-4">
			<BackButton />

			{/* Movie Poster */}
			<div className="flex justify-center my-4">
				{movie.Poster && movie.Title && (
					<img
						src={movie.Poster}
						alt={movie.Title}
						width={300}
						height={450}
						className="rounded-lg shadow-md"
					/>
				)}
			</div>

			<h1 className="text-3xl font-bold text-center">{movie.Title}</h1>
			<p className="text-center text-gray-500">
				{movie.Year} - {movie.Genre}
			</p>

			{/* Movie Details */}
			<div className="mt-4">
				<p>
					<strong>Director:</strong> {movie.Director}
				</p>
				<p>
					<strong>Writer:</strong> {movie.Writer}
				</p>
				<p>
					<strong>Actors:</strong> {movie.Actors}
				</p>
				<p>
					<strong>Language:</strong> {movie.Language}
				</p>
				<p>
					<strong>Country:</strong> {movie.Country}
				</p>
				<p>
					<strong>Released:</strong> {movie.Released}
				</p>
				<p>
					<strong>Runtime:</strong> {movie.Runtime}
				</p>
				<p>
					<strong>Rated:</strong> {movie.Rated}
				</p>
				<p>
					<strong>Awards:</strong> {movie.Awards}
				</p>
				<p>
					<strong>Box Office:</strong> {movie.BoxOffice}
				</p>
				<p>
					<strong>Production:</strong> {movie.Production}
				</p>
				<p>
					<strong>Website:</strong> {movie.Website || 'N/A'}
				</p>

				<p className="mt-4 text-lg">
					<strong>Plot:</strong> {movie.Plot}
				</p>
			</div>

			{/* Ratings Chart */}
			<div className="mt-8">
				<MovieChart ratingsData={ratingsData} />
			</div>
		</div>
	);
}
