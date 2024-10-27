import { Loader } from "lucide-react";

export function Loading(){
  return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-16 w-16 text-gray-600" />
    </div>
  );
}
