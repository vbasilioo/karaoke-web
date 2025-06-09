'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useSearchMusic } from "@/hook/music/use-search-music";
import Image from "next/image";
import { Button } from "../ui/button";
import { Loading } from "../global/loading";
import { useGetMe } from "@/hook/user/use-get-me";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { adjustQueue } from "@/app/api/music/adjust-queue";
import { useMutation } from "@tanstack/react-query";
import { storeMusic } from "@/app/api/music/store-music";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useGetQueue } from "@/hook/queue/use-get-queue";
import { useSession } from "next-auth/react";

interface MusicSnippet {
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    high: {
      url: string;
    };
    default: {
      url: string;
    };
  };
}

interface MusicItem {
  snippet: MusicSnippet;
  id: {
    videoId: string;
  };
}

interface IFormInput {
  showId: string;
  userId: string;
}

export function Music() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedMusic, setSelectedMusic] = useState<MusicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("temporaryUser") ?? "";
  const { data: session } = useSession();
  const adminId = session?.admin?.id ?? "";

  const search = z.string().parse(searchParams.get("search") ?? "");

  const { data: musics } = useSearchMusic({
    search,
    page: 1,
    per_page: 9,
  });

  const { data: userme, isLoading: isUserLoading } = useGetMe(userId);

  const { refetch: refetchQueue } = useGetQueue(adminId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const { mutateAsync: createMusic } = useMutation({
    mutationFn: storeMusic,
    mutationKey: ["store-music"],
    async onSuccess() {
      await adjustQueue();
      await refetchQueue();
      reset();
    },
    onError: () => {
      setIsModalLoading(false);
      setIsModalOpen(false);
      setTimeout(() => setIsModalOpen(true), 50);
    },
  });

  const handleSearch = () => {
    if (searchInput.trim()) {
      const currentParams = new URLSearchParams(searchParams.toString());
      if (userId) {
        currentParams.set('temporaryUser', userId);
      }
      currentParams.set('search', searchInput);
      router.push(`?${currentParams.toString()}`);
    }
  };

  const handleCantarClick = (music: MusicItem) => {
    setSelectedMusic(music);
    setIsModalOpen(true);

    if (!userme && !isUserLoading) {
      setTimeout(() => {
        setIsModalOpen(false);
        setTimeout(() => setIsModalOpen(true), 1000);
      }, 100);
    }
  };

  const handleConfirm = async () => {
    if (!selectedMusic || !userme) return;

    const userData = userme.data[0];
    if (!userData || !userData.id || !userData.show_id) {
      toast.error("Dados do usuário incompletos.");
      return;
    }

    const userId = userData.id;
    const showId = userData.show_id;
    console.log("session", adminId)
    const musicData = new FormData();
    musicData.append("name", selectedMusic.snippet.title);
    musicData.append("description", selectedMusic.snippet.description);
    musicData.append("video_id", selectedMusic.id.videoId);
    musicData.append("user_id", userId);
    musicData.append("show_id", showId);

    setIsModalLoading(true);

    await createMusic(musicData);

    setIsModalOpen(false);
    setSelectedMusic(null);
    setIsModalLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMusic(null);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="justify-center text-center mb-6">
        <h1 className="text-4xl font-bold text-center dark:text-white text-black mb-2">
          Bem-vindo ao OpenMic.
        </h1>
        <h4 className="text-2xl font-medium text-center dark:text-white text-black">
          Pesquise uma música para você cantar.
        </h4>
      </div>
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

      {musics?.data && musics.data.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musics.data.items
            .filter((music) => music.snippet.description?.trim()) // Filtra apenas os vídeos com descrição
            .map((music, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col items-center text-center"
              >
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
                  onClick={() => handleCantarClick(music)}
                >
                  Cantar
                </Button>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Nenhuma música pesquisada.</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {isUserLoading ? (
            <Loading />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirmação</DialogTitle>
                <DialogDescription>
                  Você deseja cantar "{selectedMusic?.snippet.title}"?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  className="bg-green-600 text-white mr-2"
                  onClick={handleConfirm}
                  disabled={isModalLoading}
                >
                  {isModalLoading ? "Carregando..." : "Confirmar"}
                </Button>
                <Button className="bg-red-600 text-white" onClick={handleCancel}>
                  Cancelar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}