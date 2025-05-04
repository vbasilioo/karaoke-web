"use client";

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

export default function LoginForm() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFieldsEnabled, setIsFieldsEnabled] = useState(true); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const router = useRouter();

  const { mutateAsync: storeUser } = useMutation({
    mutationFn: createUser,
    mutationKey: ["create-user"],
    async onSuccess(data) {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["create-user"] });
        router.push(`/musica?temporaryUser=${data.data.id}`);
        reset();
        setPhoto(null);
      }
    },
    async onError() {
      toast.error("Falha ao criar um usuário temporário.");
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = { ...data, photo };
      await storeUser(formData);
    } catch (error: any) {
      console.error("Error processing form:", error);
      toast.error("Falha ao processar o formulário.");
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
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/png");
      setPhoto(imageDataUrl);
      setCameraActive(false);

      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Escolha um avatar ou tire uma foto para começar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-2">
              <Label className="text-sm text-muted-foreground">
                Avatar selecionado:
              </Label>
              {photo ? (
                <img
                  src={photo}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300" />
              )}
            </div>

            {/* Upload / Câmera / Avatares */}
            <div className="grid gap-2">
              <Button type="button" variant="outline" onClick={handleTakePhoto}>
                Tirar Foto com a Câmera
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPhoto(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Label className="text-sm mt-2">Ou escolha um personagem:</Label>
              <div className="flex justify-between gap-2">
                {["avatar1.png", "avatar2.png", "avatar3.png", "avatar4.png"].map((img, idx) => (
                  <img
                    key={idx}
                    src={`/avatars/${img}`}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setPhoto(`/avatars/${img}`)}
                    className={`w-16 h-16 rounded-full cursor-pointer border-2 ${photo === `/avatars/${img}`
                        ? "border-cyan-600"
                        : "border-transparent"
                      }`}
                  />
                ))}
              </div>
            </div>

            {cameraActive && (
              <div className="flex flex-col items-center gap-2">
                <video ref={videoRef} autoPlay className="w-full rounded-md" />
                <Button type="button" onClick={capturePhoto}>
                  Capturar Foto
                </Button>
              </div>
            )}

            {/* Form fields */}
            <div className="grid gap-2 mt-4">
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

              <Label htmlFor="code_access">Código de Acesso</Label>
              <Input
                id="code_access"
                type="text"
                {...register("code_access")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
