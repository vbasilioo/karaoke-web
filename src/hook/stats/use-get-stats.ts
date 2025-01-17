import { useEffect, useState } from "react";

export const useGetStats = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const fakeData = [
        {
          music: { name: "Ana Castela - RAM TCHUM" },
          request_count: Math.floor(Math.random() * 100),
        },
        {
          music: { name: "Jorge e Mateus - Paredes" },
          request_count: Math.floor(Math.random() * 100),
        },
        {
          music: { name: "Quadros (Prod. JXNVS)" },
          request_count: Math.floor(Math.random() * 100),
        },
      ];
      setData({ data: { data: fakeData } });
    };

    fetchStats();
  }, []);

  return { data };
};
