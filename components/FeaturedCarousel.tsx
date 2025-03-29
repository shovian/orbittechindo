'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

type Movie = {
    Title: string;
    Year: string;
    imdbID: string;
    Poster: string;
};

const FeaturedCarousel: React.FC = () => {
    const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            try {
                const response = await fetch(`/api/movies?query=Avengers&type=movie&carousel=true`);
                const data = await response.json();

                if (data) {
                    setFeaturedMovies(data.slice(0, 5)); // Get top 5 movies
                } else {
                    setError('No featured movies found.');
                }
            } catch (err) {
                setError('Error fetching featured movies.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedMovies();
    }, []);

    if (loading) return <p className="text-center">Loading featured movies...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4 self-start">Editor's Picks</h2>
            <div className="w-full flex justify-center">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                    className="w-full max-w-3xl rounded-lg shadow-lg"
                >
                    {featuredMovies.map((movie) => (
                        <SwiperSlide key={movie.imdbID} className="flex items-center">
                            <div className='w-full  items-center justify-center flex'>
                                <div className="relative w-48 sm:w-56 flex flex-col items-center">
                                    <img
                                        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                                        alt={movie.Title}
                                        className="w-full h-auto object-cover bg-slate-300 rounded-lg shadow-lg"
                                    />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-md text-center">
                                        <h3 className="text-sm sm:text-base font-semibold">{movie.Title} ({movie.Year})</h3>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default FeaturedCarousel;
