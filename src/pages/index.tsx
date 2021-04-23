// SPA
// SSR
// SSG - static site generator -> como só é postado 1 episódio por dia, não há necessidade de buscar os dados várias vezes

import { GetStaticProps } from 'next';
import Image from 'next/image';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns'; //parseISO pega uma data e converte para data do javascript
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

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
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
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
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>

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