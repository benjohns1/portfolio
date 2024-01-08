import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { parseMDX } from "./utils/mdxParser";

export const getPages = (folder) => {
  const filenames = fs.readdirSync(path.join(folder));
  const markdownFiles = filenames.filter((filename) => filename.endsWith(".md") && !filename.startsWith("_"));
  return markdownFiles.reduce((pages, filename) => {
    const contents = fs.readFileSync(path.join(folder, filename), "utf-8");
    const parsed = matter(contents);
    const frontmatter = JSON.parse(JSON.stringify(parsed.data));
    if (frontmatter.draft || frontmatter.layout === "404") {
      return pages;
    }
    const slug = frontmatter.slug ?? filename.replace(".md", "");
    const content = parsed.content;
    pages.push({ frontmatter, slug, content });
    return pages;
  }, []);
};

export const getRegularPage = async (slug) => {
  const publishedPages = getPages("content");
  const pageData = publishedPages.filter((data) => data.slug === slug);

  let frontmatter, content;
  if (pageData.length > 0 && pageData[0]) {
    content = pageData[0].content;
    frontmatter = pageData[0].frontmatter;
  } else {
    const notFoundPage = fs.readFileSync(path.join("content/404.md"), "utf-8");
    const notFoundDataParsed = matter(notFoundPage);
    content = notFoundDataParsed.content;
    frontmatter = notFoundDataParsed.data;
  }
  const mdxContent = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};
