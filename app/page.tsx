
import MovieSearchPage from "@/components/MovieSearchPage";
import Image from "next/image";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[100dvh] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="bg-slate-200 rounded-md flex flex-col row-start-2 items-center sm:items-start">
       <MovieSearchPage/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        this page is limited to be test purpose only
      </footer>
    </div>
  );
}
