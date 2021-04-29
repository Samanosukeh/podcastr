// SPA
// SSR
// SSG - static site generator -> como só é postado 1 episódio por dia, não há necessidade de buscar os dados várias vezes

import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';//usado para que ao clicar em um link não carrege todo o conteúdo que ja foi carregado
import { api } from '../services/api';
import { format, parseISO } from 'date-fns'; //parseISO pega uma data e converte para data do javascript
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../contexts/PlayerContext';

import styles from './home.module.scss';

type Episode = {//array do tipo objeto com os seguintes itens abaixo
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  members: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {//recebendo os props buscados no await
  const { playList } = usePlayer();// pegando apenas a função playList

  const episodeList = [...latestEpisodes, ...allEpisodes];
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>

        <ul>
          {latestEpisodes.map((episode, index) => {//cada episodio tem um index
            return (
              <li key={episode.id}>
                {/* Image serve para manter as imagens no mesmo tamanho, altura e largura serve como 
                o tamanho que quero carregar a imagem, não mostrar */}
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover" //objectFit faz a imagem se enquadrar no tamanho desejado, outro ex: domain
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                {/*Passando uma arrow funcion por que a função passada nao tem retorno e recebe um argumento */}
                <button type="button" onClick={() => playList(episodeList, index)}> {/*o primeiro começa a partir do momento que acada os 2 ultimos */}
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72}}>
                    <Image 
                     width={120}
                     height={120}
                     src={episode.thumbnail}
                     alt={episode.title}
                     objectFit="cover"
                    />
                  </td>

                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>

      </section>
    </div>
  )
}


//só de declarar essa função ja vai valer o SSR
export const getStaticProps: GetStaticProps = async () => { //static site generation só funciona em produção -> getStaticProps()
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  /**
   * Formatar os dados logo depois de pegar para evitar renderizações sem necessidade se fosse
   * formatar no componente
   */
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),//dia, mes[:3] e ano
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);//pegando 2 eps
  const allEpisodes = episodes.slice(2, episodes.length);
  
  return {
    props: {
      latestEpisodes, allEpisodes
    },
    //a cada 8 horas gere de novo essa página
    revalidate: 60 * 60 * 8,//tempo em segundos de quanto e quanto tempo quero gerar de novo essa nova página
  }
}