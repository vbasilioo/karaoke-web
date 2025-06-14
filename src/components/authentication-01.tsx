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
import Image from "next/image";

export default function LoginForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const router = useRouter();

  const { mutateAsync: storeUser, isPending } = useMutation({
    mutationFn: createUser,
    mutationKey: ["create-user"],
    async onSuccess(data) {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["create-user"] });
        router.push(`/musica?temporaryUser=${data.data.id}`);
        reset();
        setPhotoPreview(null);
        setPhotoFile(null);
        setSelectedAvatar(null);
      }
    },
    async onError(error: any) {
      console.error("Error creating user:", error);
      toast.error(error?.response?.data?.message || "Falha ao criar um usuário temporário.");
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("username", data.username);
      formData.append("table", data.table);
      formData.append("telephone", data.telephone || "");
      formData.append("code_access", data.code_access);

      if (photoFile) {
        formData.append("photo", photoFile);
      } else if (selectedAvatar) {
        formData.append("avatarUrl", selectedAvatar);
      }

      await storeUser(formData);
    } catch (error: any) {
      console.error("Error processing form:", error);
      toast.error("Falha ao processar o formulário.");
    }
  };

  const handleTakePhoto = async () => {
    try {
      setCameraActive(true);
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Não foi possível acessar a câmera.");
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/png");
        setPhotoPreview(imageDataUrl);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.png", { type: "image/png" });
            setPhotoFile(file);
            setSelectedAvatar(null);
          }
        }, "image/png");
      }

      setCameraActive(false);

      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedAvatar(null);
    }
  };

  const selectAvatar = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    setPhotoPreview(avatarPath);
    setPhotoFile(null);
  };

  const avatars = [
    "/character-1.jpeg",
    "/character-2.jpeg",
    "/character-3.jpeg",
    "/character-4.jpeg"
  ];

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
            <div className="flex flex-col items-center gap-2">
              <Label className="text-sm text-muted-foreground">
                Avatar selecionado:
              </Label>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300" />
              )}
            </div>

            <div className="grid gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Label className="text-sm mt-2">Ou escolha um personagem:</Label>
              <div className="flex justify-between gap-2">
                {avatars.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => selectAvatar(avatar)}
                    className={`w-16 h-16 rounded-full cursor-pointer border-2 ${selectedAvatar === avatar
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

            <div className="grid gap-2 mt-4">
              <Label htmlFor="username">Nome</Label>
              <Input
                id="username"
                type="text"
                placeholder="Insira seu nome"
                {...register("username", { required: "Nome é obrigatório" })}
              />
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username.message?.toString()}</p>
              )}

              <Label htmlFor="table">Mesa</Label>
              <Input
                id="table"
                type="number"
                placeholder="Insira o número da mesa"
                {...register("table", { required: "Mesa é obrigatória" })}
              />
              {errors.table && (
                <p className="text-red-500 text-xs">{errors.table.message?.toString()}</p>
              )}

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
                placeholder="Código de acesso"
                {...register("code_access", { required: "Código de acesso é obrigatório" })}
              />
              {errors.code_access && (
                <p className="text-red-500 text-xs">{errors.code_access.message?.toString()}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}