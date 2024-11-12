"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMusic } from "@/app/api/music/search-music";
import { ISearchRoot, ISearchYoutubeMusic } from "@/interfaces/music";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader, Search } from "lucide-react";
import { z } from "zod";
import { useSearchMusic } from "@/hook/music/use-search-music";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loading } from "../global/loading";
import { Error } from "../global/error";
import { MusicModal } from "./music-modal";

export function Music() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const search = z.string().parse(searchParams.get("search") ?? "");

  const { data: musics, isLoading, isError } = useSearchMusic({
    search,
    page: 1,
    per_page: 9
  });

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`?search=${searchInput}`);
    }
  };

  if(isLoading) return <Loading />;

  if(isError) return <Error title="Falha ao encontrar música." description="Não foi possível encontrar a música pesquisada." />;

  const openModal = (music: any) => {
    setSelectedMusic(music);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMusic(null);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative w-96 mb-10">
        <input
          type="text"
          className="border p-2 pl-4 pr-12 rounded-md w-full"
          placeholder="Pesquisar música"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {musics?.data && musics?.data?.items?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musics.data.items.map((music, index: number) => (
            <div key={index} className="border rounded-lg p-4 flex flex-col items-center text-center">
              <Image
                src={music.snippet.thumbnails.high.url ?? music.snippet.thumbnails.default.url}
                alt={music.snippet.title}
                width={320}
                height={200}
                className="mb-2 w-full"
              />
              <h3 className="text-lg font-semibold">{music.snippet.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                Descrição: <span>{music.snippet.description}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Canal: <span>{music.snippet.channelTitle}</span>
              </p>
              <Button
                className="mt-2 bg-cyan-900 w-full font-bold dark:font-bold dark:text-white"
                onClick={() => openModal(music)}
              >
                Cantar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Nenhuma música encontrada.</p>
      )}

      {isModalOpen && selectedMusic && (
        <MusicModal music={selectedMusic} closeModal={closeModal} />
      )}
    </div>
  );
}
