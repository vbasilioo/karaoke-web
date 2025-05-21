"use client";

import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useGetQueue } from "@/hook/queue/use-get-queue";
import { useDestroyQueue } from "@/hook/queue/use-destroy-queue";
import { X } from "lucide-react";
import { toast } from "sonner";

export function Queue() {
  const { data: session } = useSession();
  const adminId = session?.admin?.id ?? '';
  const [sessionData, setSession] = useState<any>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const { data, refetch } = useGetQueue(adminId);
  const { mutate: removeFromQueue } = useDestroyQueue();

  const sortedQueue = data?.data
    .filter(item => item.music)
    .sort((a, b) => a.music.position - b.music.position) || [];

  const handleRemoveFromQueue = (userId: string, position: number) => {
    removeFromQueue(
      { id: userId, position },
      {
        onSuccess: () => {
          toast.success("Usuário removido da fila com sucesso.");
          refetch();
        },
        onError: () => {
          toast.error("Erro ao remover usuário da fila.");
        }
      }
    );
  };

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
              <th className="border p-1 md:p-2">Ação</th>
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
                <td className="border p-1 md:p-2">
                  <button
                    onClick={() => handleRemoveFromQueue(item.user.id, item.music.position)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remover da fila"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
