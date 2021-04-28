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

  /*função para manipular o estado*/
  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);//para que o ep acima seja o que está tocando no momento
  }

  return (
    //tudo que ta dentro da tag PlayerContext tem acesso ao contexto
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play}}> 
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
