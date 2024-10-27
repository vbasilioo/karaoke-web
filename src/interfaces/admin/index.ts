import { IApiRoot, ITimestamps } from "../api";
import { z } from "zod";
import { loginFormSchema } from "@/schemas/auth";

export interface IAdministrator extends ITimestamps {
  name: string;
  email: string;
  password: string;
}

export interface IAdministratorLogin extends IApiRoot {
  admin: IAdministrator,
  token: string,
}

export type LoginFormData = z.infer<typeof loginFormSchema>
