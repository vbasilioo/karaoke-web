import { IApiRoot, IPaginate, ITimestamps } from "../api"

export interface IUser extends ITimestamps {
  username: string
  telephone: string
  table: number;
  show: IShow;
}

export interface IShow {
  id: string
  name: string
  hour_start: string
  hour_end: string
  date_show: string
  type: string
  code_access: number
  admin_id: string
  created_at: string
  updated_at: string
  deleted_at: any
}


export interface IGetUser extends IApiRoot {
  data: IPaginate & {
    data: IUser
  }
}

interface MyUser extends ITimestamps {
  username: string
  telephone: string
  table: number
  show_id: string
  admin_id: any
}

export interface IMeUser extends IApiRoot {
  data: MyUser[];
}
