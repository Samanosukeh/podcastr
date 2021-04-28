import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContext';

import styles from '../styles/app.module.scss';
import { useState } from 'react';

/**
 * Esse é o arquivo que fica por volta de toda a aplicação
 */

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);//variável de estado para alterar um estado no React
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);//true porque quando der play em um episódio ele já sai tocando

  /*função para manipular o estado*/
  function play(episode) {
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
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState}}> 
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp

//comparado ao arquivo default.vue do Vue
