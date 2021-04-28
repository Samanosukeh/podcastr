import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import styles from './episode.module.scss';

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

export default function Episode({episode}: EpisodeProps){
    return(
        <div className={styles.episode}>

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
                <button type="button">
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
    )
}

/*
 *Esse função tem que ser usada em toda página que tem parâmetros dinâmicos 
 * porque essa página precisa ser gerada de forma estática mesmo sendo uma
 * página dinâmica
*/
export const getStaticPaths: GetStaticPaths = async () => {
    return {//retorna quais episódios quer gerar no momento da build
        paths: [],//como ta vazio, nenhum episódio vai ser gerado durante a build
        fallback: 'blocking',//quando clicar em um link, só vai carregar a tela se a pessoa clicar, melhor opção para SEO
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug} = context.params;
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),//dia, mes[:3] e ano
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,//recarregue essa página a cada 24 horas
    }
}