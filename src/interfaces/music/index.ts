import { IApiRoot, IPaginate, IPaginateRoot, ITimestamps } from "../api";
import { IUser } from "../user";
import { MusicEnum } from "./music-enum";

export interface IMusic extends ITimestamps {
  name: string;
  description: string;
  video_id: string;
  user_id: string;
  show_id: string;
}

export interface IGetMusicProps extends IApiRoot {
  data: IMusic;
}
export interface ISearchYoutubeMusic extends IApiRoot {
  data: ISearchRoot
}

export interface ISearchRoot {
  kind: string
  etag: string
  nextPageToken: string
  regionCode: string
  pageInfo: IPageInfo
  items: ISearchItem[]
}

export interface IPageInfo {
  totalResults: number
  resultsPerPage: number
}

export interface ISearchItem {
  kind: string
  etag: string
  id: IYoutubeId
  snippet: ISnippet
}

export interface IYoutubeId {
  kind: string
  videoId: string
}

export interface ISnippet {
  publishedAt: string
  channelId: string
  title: string
  description: string
  thumbnails: IThumbnails
  channelTitle: string
  liveBroadcastContent: string
  publishTime: string
}

export interface IThumbnails {
  default: IThumbInfo
  medium: IThumbInfo
  high: IThumbInfo
}

export interface IThumbInfo {
  url: string
  width: number
  height: number
}

export interface IGetQueueMusics extends ITimestamps{
  name: string
  description: string
  video_id: string
  user_id: string
  show_id: any
  created_at: string
  updated_at: string
  deleted_at: any
  user: IUser
}

export interface IGetQueueMusicsProps extends IApiRoot {
  data: IGetQueueMusics[]
}
