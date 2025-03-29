// app/api/movies/route.ts

import { Movie } from '@/store/movieStore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyRefreshToken } from '../data/dummyTokens';

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Helper function to fetch movie details
const fetchMovieDetails = async (imdbID: string) => {
	const response = await fetch(
		`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`
	);
	const data: {
		Response: string;
		Ratings: { Source: string; Value: string }[];
	} = await response.json();
	if (data.Response === 'True' && data.Ratings && data.Ratings.length > 0) {
		const rating = data.Ratings[0];
		return { value: rating.Value, source: rating.Source };
	}
	return undefined;
};

export async function GET(req: Request) {
	// Access cookies using 'cookies()' from 'next/headers'
	const cookieStore = await cookies();
	const refreshToken = cookieStore.get('refreshToken')?.value;

	const { searchParams } = new URL(req.url);
	const carousel = searchParams.get('carousel');

	if (!carousel) {
		// If the refresh token is missing, return an error
		if (!refreshToken) {
			return NextResponse.json(
				{ error: 'Missing refresh token' },
				{ status: 401 }
			);
		}

		// Verify the refresh token
		const userId = verifyRefreshToken(refreshToken);
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
	}

	const query = searchParams.get('query');
	const type = searchParams.get('type');
	const startYear = searchParams.get('startYear');
	const endYear = searchParams.get('endYear');

	if (!query || !type) {
		return NextResponse.json(
			{ error: 'Query and type are required' },
			{ status: 400 }
		);
	}

	try {
		let yearRange: number[] = [];
		if (startYear && endYear) {
			const start = parseInt(startYear);
			const end = parseInt(endYear);
			for (let year = start; year <= end; year++) {
				yearRange.push(year);
			}
		}

		let allMovies: Movie[] = [];
		const pageSize = 6;

		const fetchMoviesForYear = async (year: number) => {
			const response = await fetch(
				`https://www.omdbapi.com/?s=${query}&type=${type}&y=${year}&apikey=${OMDB_API_KEY}`
			);

			const data: { Response: string; Search: Movie[]; Error?: string } =
				await response.json();
			if (data.Response === 'True') {
				return data.Search;
			} else {
				return [];
			}
		};

		if (!startYear && !endYear) {
			const response = await fetch(
				`https://www.omdbapi.com/?s=${query}&type=${type}&apikey=${OMDB_API_KEY}`
			);

			const data: { Response: string; Search: Movie[]; Error?: string } =
				await response.json();
			if (data.Response === 'True') {
				allMovies = data.Search;
			}
		} else {
			let currentYearIndex = 0;
			while (
				currentYearIndex < yearRange.length &&
				allMovies.length < pageSize
			) {
				const year = yearRange[currentYearIndex];
				const moviesForYear = await fetchMoviesForYear(year);

				allMovies = [...allMovies, ...moviesForYear];
				currentYearIndex++;
			}
		}

		const moviesWithRatings = await Promise.all(
			allMovies.map(async (movie) => {
				const rating = await fetchMovieDetails(movie.imdbID);
				return { ...movie, Rating: rating };
			})
		);

		return NextResponse.json(moviesWithRatings.slice(0, pageSize));
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch data' },
			{ status: 500 }
		);
	}
}
