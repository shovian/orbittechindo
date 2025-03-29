import MovieDetailPage from '@/components/MovieDetailPage';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;


export default async function MoviePage({ params }: { params: Params }) {
	const { id } = (await params);

	if (!id) return notFound();

	return <MovieDetailPage movieId={id} />;
}
