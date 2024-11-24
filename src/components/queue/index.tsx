import { useGetQueue } from "@/hook/queue/use-get-queue";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function Queue() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const { data } = useGetQueue(session?.admin?.id ?? '');

  const sortedQueue = data?.data
    .filter(item => item.music)
    .sort((a, b) => a.music.position - b.music.position) || [];

  return (
    <div className="p-4 text-center">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[300px] text-xs md:text-sm lg:text-base">
          <thead>
            <tr>
              <th className="border p-1 md:p-2">Nome</th>
              <th className="border p-1 md:p-2 hidden sm:table-cell">Show</th>
              <th className="border p-1 md:p-2">Telefone</th>
              <th className="border p-1 md:p-2 hidden md:table-cell">Mesa</th>
              <th className="border p-1 md:p-2">Música</th>
              <th className="border p-1 md:p-2 hidden sm:table-cell">Posição</th>
            </tr>
          </thead>
          <tbody>
            {sortedQueue.map((item) => (
              <tr key={item.id}>
                <td className="border p-1 md:p-2">{item.user.username}</td>
                <td className="border p-1 md:p-2 hidden sm:table-cell">{item.music.name}</td>
                <td className="border p-1 md:p-2">{item.user.telephone}</td>
                <td className="border p-1 md:p-2 hidden md:table-cell">{item.user.table}</td>
                <td className="border p-1 md:p-2">{item.music.name}</td>
                <td className="border p-1 md:p-2 hidden sm:table-cell">{item.music.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
