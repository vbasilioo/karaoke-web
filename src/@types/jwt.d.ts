import { IAdministrator } from "@/interfaces/admin";

declare module 'next-auth/jwt' {
  interface JWT {
    admin?: IAdministrator;
    token: string;
    role?: string;
  }
}
