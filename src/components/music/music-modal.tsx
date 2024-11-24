import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { storeMusic } from "@/app/api/music/store-music";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adjustQueue } from "@/app/api/music/adjust-queue";
import { Button } from "../ui/button";

interface IMusicModalProps {
  music: {
    snippet: {
      title: string;
      description: string;
    };
    id: {
      videoId: string;
    };
  };
  closeModal: () => void;
  showId: string;
  userId: string;
}

interface IFormInput {
  showId: string;
  userId: string;
}

export function MusicModal({ music, closeModal, showId, userId }: IMusicModalProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ['store-music', 'get-queue'] });
      reset();
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar música");
    },
  });

  const onSubmit = async () => {
    const musicData = new FormData();
    musicData.append('name', music.snippet.title);
    musicData.append('description', music.snippet.description);
    musicData.append('video_id', music.id.videoId);
    musicData.append('user_id', userId);
    musicData.append('show_id', showId);

    await createMusic(musicData);
  };

  return (
    <>
      <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="mt-2 bg-cyan-900 w-full font-bold dark:font-bold dark:text-white"
            onClick={() => setIsConfirmationOpen(true)}
          >
            Cantar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja cantar a música "{music.snippet.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmationOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onSubmit}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
