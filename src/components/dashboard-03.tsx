import { Badge } from "@/components/ui/badge";
import { useGetQueueMusic } from "@/hook/music/use-get-queue-music";
import { useNextMusic } from "@/hook/music/use-next-music";
import Link from "next/link";

export default function Dashboard() {
  const {
    data: nextMusicData
  } = useNextMusic();

  const {
    data: getMusicData
  } = useGetQueueMusic();

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
            <Badge variant="outline" className="absolute right-3 top-3">
              TV
            </Badge>
            {nextMusicData && nextMusicData.data && (
              <>
                <h2 className="text-lg font-bold mb-2 text-white">{nextMusicData.data.name}</h2>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${nextMusicData.data.video_id}`}
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
              {getMusicData?.data?.map((musicItem, index) => (
                <div key={index} className="flex items-center p-2 rounded bg-zinc-700">
                  <div className="h-10 w-10 rounded-full bg-blue-300 mr-2" />
                  <span className="text-white">{musicItem.user?.username}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
