import { createUser } from "@/app/api/user/create-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";

const QRScanner: any = require('react-qr-scanner');

export default function LoginForm() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isFieldsEnabled, setIsFieldsEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const router = useRouter();

  const { mutateAsync: storeUser } = useMutation({
    mutationFn: createUser,
    mutationKey: ['create-user'],
    async onSuccess(data) {
      if (data) {
        console.log('data data: ', data.data);
        queryClient.invalidateQueries({ queryKey: ['create-user'] });
        router.push(`/musica?temporaryUser=${data.data.id}`);
        reset();
        setPhoto(null);
      }
    },
    async onError() {
      toast.error('Falha ao criar um usuário temporário.');
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = { ...data, photo };
      const result = await storeUser(formData);
      console.log(result);
    } catch (error: any) {
      console.error(
        'Error processing form:',
        error.response?.data || error.message || error,
      );
      toast.error('Falha ao processar o formulário.');
    }
  };

  const handleTakePhoto = async () => {
    setCameraActive(true);
    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/png');
      setPhoto(imageDataUrl);
      setCameraActive(false);

      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setQrCodeData(data);
      setIsFieldsEnabled(true);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Leia o QR Code para liberar os campos de entrada.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {/* <div className="flex justify-center mt-4">
              <QRCode value={qrCodeData || "OpenMic"} size={128} />
            </div>

            <div className="flex justify-center">
              <QRScanner
                delay={300}
                style={{ width: "100%" }}
                onError={handleError}
                onScan={handleScan}
              />
            </div> */}

              <div className="grid gap-2">
                <Label htmlFor="username">Nome</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Thays"
                  {...register("username", { required: "Nome é obrigatório" })}
                />

                <Label htmlFor="table">Mesa</Label>
                <Input
                  id="table"
                  type="number"
                  placeholder="10"
                  {...register("table", { required: "Mesa é obrigatória" })}
                />

                <Label htmlFor="telephone">Telefone</Label>
                <Input
                  id="telephone"
                  type="text"
                  placeholder="(12) 99999-9999"
                  {...register("telephone")}
                />
                 <Input
                  id="code_access"
                  type="text"
                  placeholder="(12) 99999-9999"
                  {...register("code_access")}
                />
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Entrar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
