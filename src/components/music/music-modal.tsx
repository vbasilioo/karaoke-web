import { adjustQueue } from "@/app/api/music/adjust-queue";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { storeMusic } from "@/app/api/music/store-music";
import { useGetShow } from "@/hook/show/use-get-show";
import { IShow } from "@/interfaces/show";
import { Loading } from "../global/loading";
import { formatFullDate } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useGetUser } from "@/hook/user/use-get-user";
import { IUser } from "@/interfaces/user";
import { useState } from "react";

interface IMusicModalProps {
  music: {
    snippet: {
      title: string;
      description: string;
      video_id: string;
      user_id: string;
      show_id: string;
    };
    id: {
      videoId: string;
    };
  };
  closeModal: () => void;
}

interface IFormInput {
  showId: string;
  userId: string;
}

export function MusicModal({ music, closeModal }: IMusicModalProps) {
  const { data: shows, isLoading: isLoadingShows } = useGetShow();
  const [showId, setShowId] = useState("");
  const { data: users } = useGetUser(showId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const queryClient = useQueryClient();

  const { mutateAsync: createMusic } = useMutation({
    mutationFn: storeMusic,
    mutationKey: ['store-music'],
    async onSuccess() {
      await adjustQueue();
      queryClient.invalidateQueries({ queryKey: ['store-music'] });
      reset();
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar música");
    },
  });

  const onSubmit = async (data: IFormInput) => {
    const musicData = new FormData();
    musicData.append('name', music.snippet.title);
    musicData.append('description', music.snippet.description);
    musicData.append('video_id', music.id.videoId);
    musicData.append('user_id', data.userId);
    musicData.append('show_id', data.showId);

    await createMusic(musicData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Cantar: {music.snippet.title}</h2>
        <p className="text-gray-500 mb-4">Descrição: {music.snippet.description}</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {isLoadingShows ? (
            <Loading />
          ) : (
            <div>
              <select
                {...register("showId", { required: "Selecione um show" })}
                className="border p-2 mb-4 w-full rounded"
                onChange={(e) => setShowId(e.target.value)}
              >
                <option value="">Selecione um show</option>
                {shows?.data.map((show: IShow) => (
                  <option key={show.id} value={show.id}>
                    {show.name} - {formatFullDate(show.date_show)}
                  </option>
                ))}
              </select>
              <Separator />
              <select
                {...register("userId", { required: "Selecione um cliente" })}
                className="border p-2 mb-4 mt-4 w-full rounded"
                disabled={!showId}
              >
                <option value="">Selecione um cliente</option>
                {users?.data.data.map((user: IUser) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button className="bg-gray-400 text-white font-bold" type="button" onClick={closeModal}>
              Cancelar
            </Button>
            <Button className="bg-cyan-900 text-white font-bold" type="submit" disabled={isLoadingShows}>
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
