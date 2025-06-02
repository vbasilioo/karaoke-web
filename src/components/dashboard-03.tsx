"use client";

import { Badge } from "@/components/ui/badge";
import { useGetQueue } from "@/hook/queue/use-get-queue";
import { useNextMusic } from "@/hook/music/use-next-music";
import Link from "next/link";
import { X } from "lucide-react";
import { useDestroyQueue } from "@/hook/queue/use-destroy-queue";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { IQueue } from "@/interfaces/queue";
import useWebSocketHook from "@/app/services/websocket";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const playerInitializedRef = useRef(false);
  const currentQueueIdRef = useRef<string | null>(null);
  const { data: getQueueData, refetch } = useGetQueue(session?.admin?.id ?? '');
  const { mutate: removeFromQueue } = useDestroyQueue();
  const { data: nextMusicData, refetch: refetchNext } = useNextMusic();
  const ws = useWebSocketHook();

  const sortedQueue = getQueueData?.data
    ? [...getQueueData.data]
        .filter(item => item.music && item.music.position !== null)
        .sort((a, b) => a.music.position - b.music.position)
    : [];
  
  const firstMusicInQueue = sortedQueue[0]?.music ?? null;
  const currentQueueId = sortedQueue[0]?.id ?? null;

  const [isWaiting, setIsWaiting] = useState(false);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (ws) {
      ws.channel('add-music')
        .listen('AddMusicEvent', (e: any) => {
          const lastMusic = e.orderQueue[e.orderQueue.length - 1];
          toast.success(`A música "${lastMusic?.name}" foi adicionada.`, { id: 'newMusic' });
          refetch();
        });
    }
  }, [ws, refetch]);

  useEffect(() => {
    if (isWaiting) {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsWaiting(false);
        setTimer(10); 
        handlePlayNextMusic();
      }
    }
  }, [isWaiting, timer]);

  useEffect(() => {
    if (currentQueueId !== currentQueueIdRef.current && !isWaiting) {
      console.log("ID da fila mudou:", currentQueueId, "anterior:", currentQueueIdRef.current);
      currentQueueIdRef.current = currentQueueId;
      
      if (playerInitializedRef.current && ytPlayerRef.current && firstMusicInQueue) {
        console.log("Carregando novo vídeo:", firstMusicInQueue.video_id);
        ytPlayerRef.current.loadVideoById(firstMusicInQueue.video_id);
      }
    }
  }, [currentQueueId, isWaiting, firstMusicInQueue]);

  useEffect(() => {
    if (!firstMusicInQueue || isWaiting) return;

    if (playerInitializedRef.current) return;

    const loadYouTubeAPI = () => {
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;

      const scriptTag = document.createElement("script");
      scriptTag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(scriptTag);
    };

    window.onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(playerRef.current, {
        height: "390",
        width: "640",
        videoId: firstMusicInQueue.video_id,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: () => {
            playerInitializedRef.current = true;
            currentQueueIdRef.current = currentQueueId;
            console.log("Player inicializado com vídeo:", firstMusicInQueue.video_id);
          },
          onStateChange: (event: any) => {
            console.log("Estado do player mudou:", event.data);
            if (event.data === window.YT.PlayerState.ENDED) {
              console.log("Vídeo terminou, iniciando timer de espera");
              setIsWaiting(true);
              setTimer(10);
            }
          },
        },
      });
    };

    if (!window.YT) {
      loadYouTubeAPI();
    } else {
      window.onYouTubeIframeAPIReady();
    }

    return () => { };
  }, [firstMusicInQueue, isWaiting, currentQueueId]);

  useEffect(() => {
    return () => {
      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy();
        playerInitializedRef.current = false;
        currentQueueIdRef.current = null;
      }
    };
  }, []);

  const handlePlayNextMusic = () => {
    if (sortedQueue.length === 0) {
      console.error("Não há músicas na fila.");
      toast.error("Não há músicas na fila.");
      return;
    }

    const firstQueueItem = sortedQueue[0];
    const position = firstQueueItem?.music?.position;

    if (firstQueueItem && position !== undefined) {
      removeFromQueue(
        { id: firstQueueItem.user.id, position },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    } else {
      console.error("Não foi possível avançar a fila: posição ou item inválido.");
      toast.error("Erro ao avançar para a próxima música.");
    }
  };

  const handleRemoveFromQueue = (userId: string, position: number) => {
    removeFromQueue(
      { id: userId, position },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

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
                {isWaiting ? (
                  <div className="flex items-center justify-center mb-4 h-[390px]">
                    <span className="text-white text-2xl font-bold">
                      Próxima música em {timer} segundo{timer !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <div ref={playerRef} className="w-full h-full" />
                )}
              </>
            )}
          </div>

          <div className="flex flex-col rounded-xl bg-zinc-800 p-4 lg:col-span-1">
            <h3 className="text-lg font-bold mb-2 text-white">Fila de Pessoas</h3>
            <div className="flex flex-col space-y-2">
              {sortedQueue.map((item: IQueue) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded bg-zinc-700">
                  <div className="flex items-center">
                    {item.user.photo ? (
                      <img
                        src={item.user.photo}
                        alt={item.user.username}
                        className="h-10 w-10 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-300 mr-2" />
                    )}
                    <div className="flex flex-col text-white">
                      <span>{item.user.username}</span>
                      <span className="text-sm text-gray-400">Música: {item.music.name}</span>
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