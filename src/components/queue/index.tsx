import { useGetQueue } from "@/hook/queue/use-get-queue";

export function Queue() {
  const {
    data
  } = useGetQueue();

  return (
    <div className="p-6 text-center">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Show</th>
            <th className="border p-2">Telefone</th>
            <th className="border p-2">Mesa</th>
            <th className="border p-2">Música</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.user.username}</td>
              <td className="border p-2">{item.music.name}</td>
              <td className="border p-2">{item.user.telephone}</td>
              <td className="border p-2">{item.user.table}</td>
              <td className="border p-2">{item.music.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
