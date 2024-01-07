import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { parseMDX } from "./utils/mdxParser";

export const getSinglePage = (folder) => {
  const filesPath = fs.readdirSync(path.join(folder));
  const sanitizeFiles = filesPath.filter((file) => file.includes(".md"));
  const filterSingleFiles = sanitizeFiles.filter((file) =>
    file.match(/^(?!_)/)
  );
  const singlePages = filterSingleFiles.map((filename) => {
    const slug = filename.replace(".md", "");
    const contents = fs.readFileSync(path.join(folder, filename), "utf-8");
    const parsed = matter(contents);
    const frontmatter = JSON.parse(JSON.stringify(parsed.data));
    const url = frontmatter.url ? frontmatter.url.replace("/", "") : slug;
    return { frontmatter: frontmatter, slug: url, content: parsed.content };
  });

  return singlePages.filter(
    (page) => !page.frontmatter.draft && page.frontmatter.layout !== "404"
  );
};

// get a regular page data from many pages, ex: about.md
export const getRegularPage = async (slug) => {
  const publishedPages = getSinglePage("content");
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
