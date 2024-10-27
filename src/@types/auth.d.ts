import { IAdministrator } from "@/interfaces/admin";

declare module 'next-auth' {
  interface Session {
    admin: IAdministrator;
    token: string;
  }

  interface Admin extends IAdministrator {
    token: string;
  }
}
