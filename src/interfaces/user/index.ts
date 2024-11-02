import { IApiRoot, IPaginate, ITimestamps } from "../api"

export interface IUser extends ITimestamps {
  username: string
  telephone: string
  table: number;
  show_id: string;
}

export interface IGetUser extends IApiRoot {
  data: IPaginate & {
    data: IUser
  }
}
