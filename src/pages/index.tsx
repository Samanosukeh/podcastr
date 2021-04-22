// SPA
// SSR
// SSG - static site generator -> como só é postado 1 episódio por dia, não há necessidade de buscar os dados várias vezes

export default function Home(props) {//recebendo os props buscados no await
  console.log(props.episodes);

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}


//só de declarar essa função ja vai valer o SSR
export async function getStaticProps() { //static site generation só funciona em produção -> getStaticProps()
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();
  
  return {
    props: {
      episodes: data,
    },
    //a cada 8 horas gere de novo essa página
    revalidate: 60 * 60 * 8,//tempo em segundos de quanto e quanto tempo quero gerar de novo essa nova página
  }
}