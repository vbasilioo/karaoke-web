import { AlertCircle } from "lucide-react";

interface IError {
  title: string;
  description: string;
}

export function Error({ title, description }: IError){
  return(
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <span className="font-bold">{title}</span>
        </div>
        <p className="mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
}
