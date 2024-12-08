import { Badge } from "@/components/ui/badge";
import { useGetQueue } from "@/hook/queue/use-get-queue";
import { useNextMusic } from "@/hook/music/use-next-music";
import Link from "next/link";
import { X } from "lucide-react";
import { useDestroyQueue } from "@/hook/queue/use-destroy-queue";
import { queryClient } from "@/lib/react-query";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import ws from "@/app/services/websocket";
import { toast } from "sonner";
import { IQueue } from "@/interfaces/queue";
import useWebSocketHook from "@/app/services/websocket";

export default function Dashboard() {

  const [session, setSession] = useState<any>(null);
  const ws = useWebSocketHook();

  useEffect(() => {
    if(ws){
      ws.channel('add-music').listen('AddMusicEvent', (e: any) => {
        if (e.orderQueue.length > 0) {
          const lastMusic = e.orderQueue[e.orderQueue.length - 1];
          toast.success(`A música "${lastMusic?.name}" foi adicionada.`, { id: 'newMusic' });
        }
    
        queryClient.invalidateQueries({ queryKey: ['get-queue'] });
      });
    }
  }, [ws]);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const { data: nextMusicData } = useNextMusic();
  const { data: getQueueData } = useGetQueue(session?.admin?.id ?? '');
  const { mutate: removeFromQueue } = useDestroyQueue();

  const handleRemoveFromQueue = (userId: string, position: number) => {
    removeFromQueue(
      { id: userId, position },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['get-queue'] });
        },
      }
    );
  };

  /*const sortedQueue = getQueueData?.data
    ?.filter(item => item.music && item.music.position !== null)
    .sort((a, b) => a.music.position - b.music.position) || [];*/
  const firstMusicInQueue = getQueueData && getQueueData?.data?.length > 0 ? getQueueData?.data[0].music : null;

  return (
    <div className="grid h-screen w-full pl-[56px] bg-zinc-900">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b border-zinc-800 bg-zinc-900 px-4">
          <Link href={'/dashboard'} className="ml-auto text-white">
            Voltar
          </Link>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-full min-h-[50vh] flex-col lg:col-span-2 bg-zinc-800 rounded-lg p-4">
            <Badge variant="outline" className="absolute right-3 top-3 text-white">
              TV
            </Badge>
            {firstMusicInQueue && (
              <>
                <h2 className="text-lg font-bold mb-2 text-white">{firstMusicInQueue.name}</h2>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${firstMusicInQueue.video_id}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </>
            )}
          </div>

          <div className="flex flex-col rounded-xl bg-zinc-800 p-4 lg:col-span-1">
            <h3 className="text-lg font-bold mb-2 text-white">Fila de Pessoas</h3>
            <div className="flex flex-col space-y-2">
              {getQueueData && getQueueData.data.filter(item => item.music && item.music.position !== null).sort((a, b) => a.music.position - b.music.position).map((item: IQueue) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-zinc-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-300 mr-2" />
                    <div className="flex flex-col text-white">
                      <span>{item.user.username}</span>
                      <span className="text-sm text-gray-400">Posição: {item.music.position}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromQueue(item.user.id, item.music.position)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
