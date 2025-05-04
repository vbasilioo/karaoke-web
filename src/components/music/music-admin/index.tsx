"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { useSearchMusic } from "@/hook/music/use-search-music";
import { useGetAllUsers } from "@/hook/user/use-get-all-user";
import { queryClient } from "@/lib/react-query";
import { storeMusic } from "@/app/api/music/store-music";
import { adjustQueue } from "@/app/api/music/adjust-queue";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/global/loading";

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

interface IUser {
    id: string;
    username: string;
    telephone: string;
    table: string;
    show_id: string;
    show: {
        name: string;
    };
    deleted_at: string | null;
}

export function MusicAdmin() {
    const [searchInput, setSearchInput] = useState("");
    const [selectedMusic, setSelectedMusic] = useState<MusicItem | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const adminId = searchParams.get("temporaryUser") ?? "";

    const search = z.string().parse(searchParams.get("search") ?? "");

    const { data: musics, isLoading } = useSearchMusic({
        search,
        page: 1,
        per_page: 9,
    });

    const { data: usersData, isLoading: isUsersLoading } = useGetAllUsers(adminId);
    const users: IUser[] = usersData?.data?.data || [];

    const { mutateAsync: createMusic } = useMutation({
        mutationFn: storeMusic,
        mutationKey: ["store-music"],
        async onSuccess() {
            await adjustQueue();
            queryClient.invalidateQueries({ queryKey: ["store-music", "get-queue"] });
            setSelectedUserId(null);
            setSelectedMusic(null);
        },
        onError: () => {
            toast.error("Erro ao cadastrar música.");
        },
    });

    const handleSearch = () => {
        if (searchInput.trim()) {
            const currentParams = new URLSearchParams(searchParams.toString());
            if (adminId) {
                currentParams.set("temporaryUser", adminId);
            }
            currentParams.set("search", searchInput);
            router.push(`?${currentParams.toString()}`);
        }
    };

    const handleCantarClick = (music: MusicItem) => {
        setSelectedMusic(music);
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedMusic || !selectedUserId) return;

        const user = users.find((u) => u.id === selectedUserId);
        if (!user) {
            toast.error("Usuário não encontrado.");
            return;
        }

        const musicData = new FormData();
        musicData.append("name", selectedMusic.snippet.title);
        musicData.append("description", selectedMusic.snippet.description);
        musicData.append("video_id", selectedMusic.id.videoId);
        musicData.append("user_id", user.id);
        musicData.append("show_id", user.show_id);

        setIsModalLoading(true);
        await createMusic(musicData);
        setIsModalLoading(false);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
        setSelectedMusic(null);
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2 dark:text-white text-black">
                    Bem-vindo ao OpenMic.
                </h1>
                <h4 className="text-2xl font-medium dark:text-white text-black">
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

            {isLoading ? (
                <p>Carregando músicas...</p>
            ) : musics?.data?.items?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {musics.data.items.map((music, index) => (
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
                                className="mt-2 bg-cyan-900 w-full font-bold text-white"
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Selecione um usuário</DialogTitle>
                    </DialogHeader>

                    {isUsersLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <ScrollArea className="h-64 w-full rounded-md border p-2 mb-4">
                                <RadioGroup
                                    onValueChange={setSelectedUserId}
                                    value={selectedUserId ?? ""}
                                >
                                    {users
                                        .filter((u) => !u.deleted_at)
                                        .map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center space-x-4 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                <RadioGroupItem value={user.id} id={user.id} />
                                                <Label htmlFor={user.id} className="w-full cursor-pointer">
                                                    <div className="flex justify-between w-full text-sm">
                                                        <span className="font-semibold">{user.username}</span>
                                                        <span>Mesa: {user.table}</span>
                                                        <span>Show: {user.show.name}</span>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                </RadioGroup>
                            </ScrollArea>

                            <DialogFooter>
                                <Button
                                    className="bg-green-600 text-white"
                                    onClick={handleConfirm}
                                    disabled={isModalLoading || !selectedUserId}
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
