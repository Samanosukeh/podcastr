// SPA
// SSR
// SSG - static site generator -> como só é postado 1 episódio por dia, não há necessidade de buscar os dados várias vezes

import { GetStaticProps } from 'next';
import { api } from '../services/api';

type Episode = {//array do tipo objeto com os seguintes itens abaixo
  id: string;
  title: string;
  members: string;
  // ...
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {//recebendo os props buscados no await
  

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
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
  
  return {
    props: {
      episodes: data,
    },
    //a cada 8 horas gere de novo essa página
    revalidate: 60 * 60 * 8,//tempo em segundos de quanto e quanto tempo quero gerar de novo essa nova página
  }
}