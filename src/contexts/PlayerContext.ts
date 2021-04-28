import { createContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}


type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number; //vai apontar o index de qual ep está tocando
    play: (episode: Episode) => void; //3° argumento é uma função do tipo void
};

export const PlayerContext = createContext({} as PlayerContextData);