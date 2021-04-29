/*
 * adicionar tudo que fica ao redor da aplicação e é chamado uma única vez
 *  */

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return(
            <Html>
                <Head>
                    {/* Adicionando as fontes aqui */}
                    <link rel="preconnect" href="https://fonts.gstatic.com" /> {/* No React toda tag precisa ter o fechamento no final </> */}
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />

                    <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}