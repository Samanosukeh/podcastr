import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}


type PlayerContextData = {//declarar aqui o tipo de cada variável de estado e funções que alteram esses estados
    episodeList: Episode[],
    currentEpisodeIndex: number; //vai apontar o index de qual ep está tocando
    play: (episode: Episode) => void; //3° argumento é uma função do tipo void
    playList: (list: Episode[], index: number) => void;
    isPlaying: boolean;//guarda o estado se um episodio ta tocando
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
    hasPrevious: boolean;
    isShuffling: boolean;
    hasNext: boolean;
    isLooping: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;//tipagem feita pra qualquer tipo de objeto
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps ) {
  const [episodeList, setEpisodeList] = useState([]);//variável de estado para alterar um estado no React
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);//true porque quando der play em um episódio ele já sai tocando
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  /*função para manipular o estado*/
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);//para que o ep acima seja o que está tocando no momento
    setIsPlaying(true);//importante para trocar o play para verdadeiro
  }

  function playList(list: Episode[], index: number){//recebe uma lista de eps e qual ep vai tocar
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);//se a pessoa tiver clicado em pausar, ele coloca para tocar de novo
  }

  function togglePlay() {//se tiver tocando pausa se tiver pausado toca
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex >0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;//se ta no modo shuffle ou tem um próximo ep

  function playNext() {
    if (isShuffling) {//salvando episódio aleatorio
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
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
          setPlayingState,
          playList,
          playNext,
          playPrevious,
          hasPrevious,
          hasNext,
          isLooping,
          toggleLoop,
          isShuffling,
          toggleShuffle,
          clearPlayerState,
        }
      }>
        { children }
    </PlayerContext.Provider>
  )
}

/* Para evitar ficar importanto o método useContext toda vez que for chamar o contexto do player */
export const usePlayer = () => {
  return useContext(PlayerContext);
}