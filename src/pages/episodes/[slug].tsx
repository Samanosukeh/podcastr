import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
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

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
    const { play } = usePlayer();

    return(
      <div className={styles.episodeContainer}>

        <div className={styles.episode}>
            <Head>
                <title>{episode.title}</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>

                <Image 
                    width={700} 
                    height={160} 
                    src={episode.thumbnail} 
                    alt={episode.title} 
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} /> 

        </div>
      </div>
    )
}

/*
 *Esse função tem que ser usada em toda página que tem parâmetros dinâmicos 
 * porque essa página precisa ser gerada de forma estática mesmo sendo uma
 * página dinâmica
*/
export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes/', {
      params: { 
        _limit: 2,
        _sort: 'published_at',
        _order: 'desc'
      }
    })
  
    const paths = data.map(episode => {
      return {
        params: {
          slug: episode.id
        }
      }
    })
  
    return {//retorna quais episódios quer gerar no momento da build
        paths: [],//como ta vazio, nenhum episódio vai ser gerado durante a build
        fallback: 'blocking',//quando clicar em um link, só vai carregar a tela se a pessoa clicar, melhor opção para SEO
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`)
  
  // formatação dos dados 
  const episode = {
      id: data.id,
      title: data.title,
      thumbnail: data.thumbnail,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
      description: data.description,
      url: data.file.url,
    }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 horas
  }
}