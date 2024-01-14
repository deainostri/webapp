import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  //

  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=XXX" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'XXX', { page_path: window.location.pathname });
            `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', 'XXX');
                            fbq('track', 'PageView');
                            `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=XXX&ev=PageView&noscript=1`}
            />
          </noscript>

          {/* Twitter */}
          <meta name="twitter:card" content="summary" key="twcard" />
          <meta name="twitter:creator" content="deainostri" key="twhandle" />

          {/* Open Graph */}
          <meta
            property="og:url"
            content="https://deainostri.com/"
            key="ogurl"
          />
          <meta
            property="og:image"
            content="https://deainostri.com/assets/images/preview.png"
            key="ogimage"
          />
          <meta property="og:site_name" content="deainostri" key="ogsitename" />
          <meta property="og:title" content="deainostri" key="ogtitle" />
          <meta
            property="og:description"
            content="5500 NFTs on Elrond crafted to depict all Romanian stereotypes with a couple of signature features of known Romanian figures."
            key="ogdesc"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
