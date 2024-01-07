import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Footer from "@partials/Footer";
import Header from "@partials/Header";
import { TaxonomySlugProvider } from "context/state";
import Head from "next/head";
import { useRouter } from "next/router";

const Base = ({
  title,
  meta_title,
  description,
  image,
  noindex,
  canonical,
  children,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const router = useRouter();
  const pageTitle = plainify( meta_title ? meta_title : title ? title : config.site.title);
  const pageDescription = plainify(description ? description : meta_description);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        {/* canonical url */}
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}

        {/* RSS links */}
        <link
          rel="alternate"
          type="application/atom+xml"
          title={`RSS Atom Feed for ${pageTitle}`}
          href="/feed/rss.xml" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`RSS Feed for ${pageTitle}`}
          href="/feed/rss.xml" />
        <link
          rel="alternate"
          type="application/json"
          title={`JSON Feed for ${pageTitle}`}
          href="/feed/feed.json" />

        {/* noindex robots */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* meta-description */}
        <meta
          name="description"
          content={pageDescription}
        />

        {/* author from config.json */}
        <meta name="author" content={meta_author} />

        {/* og-title */}
        <meta
          property="og:title"
          content={pageTitle}
        />

        {/* og-description */}
        <meta
          property="og:description"
          content={pageDescription}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${base_url}/${router.asPath.replace("/", "")}`}
        />

        {/* twitter-title */}
        <meta
          name="twitter:title"
          content={pageTitle}
        />

        {/* twitter-description */}
        <meta
          name="twitter:description"
          content={pageDescription}
        />

        {/* og-image */}
        <meta
          property="og:image"
          content={`${base_url}${image ? image : meta_image}`}
        />

        {/* twitter-image */}
        <meta
          name="twitter:image"
          content={`${base_url}${image ? image : meta_image}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {router.route !== "/posts/[single]" && (
        <TaxonomySlugProvider>
          <Header />
        </TaxonomySlugProvider>
      )}

      {/* main site */}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Base;
