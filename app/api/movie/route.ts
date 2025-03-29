import { NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Get 'id' from query params

  if (!id) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
  }

  if (!OMDB_API_KEY) {
    return NextResponse.json({ error: "OMDB API Key is missing" }, { status: 500 });
  }

  const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`);

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }

  const movie = await res.json();

  if (movie.Response === "False") {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(movie);
}
