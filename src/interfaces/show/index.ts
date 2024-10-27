import { IApiRoot, ITimestamps } from "../api"

export interface IShow extends ITimestamps {
  name: string
  hour_start: string
  hour_end: string
  date_show: string
  admin_id: string
  code_access: number
  type: string
}

export interface ICreateShowProps extends IApiRoot {
  data: IShow
}

export interface IGetShowByCodeAccess extends IApiRoot {
  data: IShow
}

export interface IGetShowProps extends IApiRoot {
  data: IShow[]
}
