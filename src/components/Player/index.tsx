import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';//como o slider só será usado nessa página o css só é importado aqui :)

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';

export function Player() {
    //referencia para pegar tag audio
    const audioRef = useRef<HTMLAudioElement>(null);//a tipagem ajuda a saber quais métodos tem dentro do objeto

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        //clearPlayerState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious
    } = usePlayer();

    //função dispara toda vez que o isPlaying tiver o valor alterado, semelhante ao watch do vue
    useEffect(() => {//controlando o play/pause da tag <audio>
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying]);

    const episode = episodeList[currentEpisodeIndex];//se a lista tiver vazia ele nao retornará nada

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (//se nao tiver episodio mostre o html abaixo
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podecast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                             trackStyle={ { backgroundColor: '#04d361'}}
                             railStyle={{ backgroundColor: '#9f75ff'}}//restante da barrinha que ainda nao foi carregada
                             handleStyle={{ borderColor: '#04d361'}}//cor da borda da bolinha
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                { episode && (
                    <audio
                      src={episode.url}
                      autoPlay
                      ref={audioRef} /* autoPlay, assim que a tag for exibida começa a tocar */
                      onPlay={() => setPlayingState(true)}
                      onPause={() => setPlayingState(false)}
                      loop={isLooping}
                    /> 
                )}

                <div className={styles.buttons}>
                    {/* Adicionado verificações para botões serem clicáveis apenas quando estiver tocando um episódio */}
                    <button
                      type="button"
                      disabled={!episode || episodeList.length === 1}//se tiver apenas 1 ep. não deixa dar shuffle :)
                      onClick={toggleShuffle}
                      className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>{/*togglePlay para pausar/tocar*/}
                        { isPlaying //se tiver tocando mostra botão pause
                            ?  <img src="/pause.svg" alt="Tocar"/>
                            :  <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}