import { IPaginate, ITimestamps } from "../api";
import { IMusic } from "../music";
import { IUser } from "../user";

export interface IQueue extends ITimestamps {
  admin_id: string
  music_id: string
  created_at: string
  updated_at: string
  deleted_at: any
  music: IMusic
  user: IUser
}

export interface IGetQueue extends IPaginate {
  data: IQueue[];
}

export interface IDeleteQueue {
  id: string;
  position: number;
}