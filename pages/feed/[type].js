import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { parseMDX } from "@lib/utils/mdxParser";
import { Feed } from "feed";
import shortcodes from "@shortcodes/all";
import {MDXRemote} from "next-mdx-remote";
import {renderToStaticMarkup} from "react-dom/server";
import * as cheerio from "cheerio";

export default function RSS() {};

export const getBaseUrl = () => {
  const prod = process.env.NEXT_PUBLIC_MAIN_DOMAIN || process.env.VERCEL_URL;
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : `https://${prod}`;
}

export const sanitizeContent = ($, baseUrl) => {
  $("a[href^='/'], img[src^='/'], [style]").each((i, elem) => {
    const $this = $(elem);
    if ($this.attr("href")) {
      $this.attr("href", `${baseUrl}/${$this.attr("href")}`);
    }
    if ($this.attr("src")) {
      $this.attr("src", `${baseUrl}/${$this.attr("src")}`);
    }
    if ($this.attr("style")) {
      $this.attr("style", null);
    }
  });
  return $("body").html();
}

export const summarize = (text, wordLength) => {
  return text.split(/\s+/).slice(0, wordLength).join(' ') + '...';
}

export const getServerSideProps = async (ctx) => {
  const baseUrl = getBaseUrl();

  const posts = getSinglePage(`content/${config.settings.blog_folder}`);
  const sorted = sortByDate(posts);
  const feedPosts = [];
  let lastUpdated;
  for (let i = 0; i < sorted.length; i++) {
    const post = posts[i];
    const mdxContent = await parseMDX(post.content);
    const htmlContent = renderToStaticMarkup(<MDXRemote {...mdxContent} components={shortcodes} />);
    const $dom = cheerio.load(htmlContent);
    const contentSanitized = sanitizeContent($dom, baseUrl);
    const postUrl = `${baseUrl}/posts/${post.slug}`;
    const fm = post.frontmatter;
    const date = new Date(fm.date);
    if (!lastUpdated || date > lastUpdated) {
      lastUpdated = date;
    }
    const description = fm.summary ?? summarize($dom.text(), 30);
    feedPosts.push({
      title: fm.title,
      guid: postUrl,
      id: postUrl,
      link: postUrl,
      description: description,
      content: contentSanitized,
      author: [
        {
          name: config.profile.name,
          link: baseUrl,
        }
      ],
      date: date,
      image: fm.image
    })
  }
  console.log(lastUpdated);

  const feed = new Feed({
    title: config.site.title,
    description: config.profile.bio,
    id: `${baseUrl}/`,
    link: `${baseUrl}/`,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${baseUrl}/${config.profile.image}`,
    favicon: `${baseUrl}/${config.site.favicon}`,
    copyright: config.params.copyright,
    updated: lastUpdated,
    feedLinks: {
      rss2: `${baseUrl}/feed/rss.xml`,
      json: `${baseUrl}/feed/rss.json`,
      atom: `${baseUrl}/feed/atom.xml`
    },
    author: {
      name: config.profile.name,
      link: baseUrl,
    }
  });
  feedPosts.forEach(post => {
    feed.addItem(post);
  })

  const out = parseFeed(ctx, feed);

  const cacheMaxAgeUntilStaleSeconds = 60; // 1 minute
  const cacheMaxAgeStaleDataReturnSeconds = 60 * 60; // 60 minutes
  ctx.res.setHeader(
    "Cache-Control",
    `public, s-maxage=${cacheMaxAgeUntilStaleSeconds}, stale-while-revalidate=${cacheMaxAgeStaleDataReturnSeconds}`
  )
  ctx.res.setHeader("Content-Type", out.contentType);
  ctx.res.write(out.content);
  ctx.res.end();

  return { props: {} };
};

const parseFeed = (ctx, feed) => {
  switch (ctx?.params?.type) {
    case "rss":
    case "rss.xml":
    case "rss2":
    case "rss2.xml":
      return {content: feed.rss2(), contentType: "text/xml"};
    case "atom":
    case "atom.xml":
      return {content: feed.atom1(), contentType: "text/xml"};
    case "json":
    case "rss.json":
      return {content: feed.json1(), contentType: "application/json"};
  }
  return {content: "404 Not Found", contentType: "text/plain"}
}
