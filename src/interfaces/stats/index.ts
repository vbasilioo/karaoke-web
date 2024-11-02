import { IApiRoot, ITimestamps } from "../api";
import { IMusic } from "../music";

export interface IStats extends ITimestamps {
    music_id: string;
    play_count: number;
    request_count: number;
    music: IMusic
}

export interface IGetStats extends IApiRoot {
    data: IStats[];
}