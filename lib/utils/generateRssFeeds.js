import config from "@config/config.json";
import { byDate } from "@lib/utils/sort";
import { parseMDX } from "@lib/utils/mdxParser";
import { summarize } from "@lib/utils/summarize";
import { Feed } from "feed";
import shortcodes from "@shortcodes/all";
import {MDXRemote} from "next-mdx-remote";
import {renderToStaticMarkup} from "react-dom/server";
import * as cheerio from "cheerio";

export const generateRssFeed = async (posts) => {
  const baseUrl = getBaseUrl();

  const sorted = byDate(posts);
  const feedPosts = [];
  let lastUpdated;
  for (let i = 0; i < sorted.length; i++) {
    const post = posts[i];
    const fm = post.frontmatter;
    const mdxContent = await parseMDX(post.content);
    const htmlContent = renderToStaticMarkup(<MDXRemote {...mdxContent} components={shortcodes} />);
    const $dom = cheerio.load(htmlContent);
    const contentSanitized = sanitizeContent($dom, baseUrl);
    const postUrl = `${baseUrl}/posts/${post.slug}`;
    const imagePath = fm.image ?? fm.image_sm;
    const imageUrl = imagePath ? `${baseUrl}${imagePath}` : undefined;
    const date = new Date(fm.date);
    if (!lastUpdated || date > lastUpdated) {
      lastUpdated = date;
    }
    const description = fm.summary ?? summarize($dom.text(), 30);
    const categories = fm.categories.map(category => ({
      name: category.toLowerCase(),
    }));
    feedPosts.push({
      title: fm.title,
      guid: postUrl,
      id: postUrl,
      link: postUrl,
      description: description,
      content: contentSanitized,
      category: categories,
      author: [
        {
          name: config.profile.name,
          link: baseUrl,
        }
      ],
      date: date,
      image: imageUrl
    })
  }

  const feed = new Feed({
    title: config.site.title,
    description: config.profile.bio,
    id: `${baseUrl}/`,
    link: `${baseUrl}/`,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${baseUrl}${config.profile.image}`,
    favicon: `${baseUrl}${config.site.favicon}`,
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

  return feed;
}

const getBaseUrl = () => {
  const prod = process.env.BASE_URL || process.env.NEXT_PUBLIC_MAIN_DOMAIN || process.env.VERCEL_URL;
  return process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : `https://${prod}`;
}

const sanitizeContent = ($, baseUrl) => {
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
