import { createContext, ReactNode, useState } from 'react';

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
    isPlaying: boolean;//guarda o estado se um episodio ta tocando
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;//tipagem feita pra qualquer tipo de objeto
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps ) {
  const [episodeList, setEpisodeList] = useState([]);//variável de estado para alterar um estado no React
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);//true porque quando der play em um episódio ele já sai tocando

  /*função para manipular o estado*/
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);//para que o ep acima seja o que está tocando no momento
    setIsPlaying(true);//importante para trocar o play para verdadeiro
  }

  function togglePlay() {//se tiver tocando pausa se tiver pausado toca
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    //tudo que ta dentro da tag PlayerContext tem acesso ao contexto
    <PlayerContext.Provider
      value={
        { 
          episodeList,
          currentEpisodeIndex,
          play,
          isPlaying,
          togglePlay,
          setPlayingState
        }
      }>
        { children }
    </PlayerContext.Provider>
  )
}