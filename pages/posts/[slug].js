import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getPages } from "@lib/contentParser";
import { parseMDX } from "@lib/utils/mdxParser";
const { blog_folder } = config.settings;

const Article = ({ post, mdxContent, slug, posts }) => {
  return (
    <PostSingle mdxContent={mdxContent} slug={slug} post={post} posts={posts} />
  );
};

export const getStaticPaths = () => {
  const allSlug = getPages(`content/${blog_folder}`);
  const paths = allSlug.map((item) => ({
    params: {
      slug: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const posts = getPages(`content/${blog_folder}`);
  const post = posts?.find((p) => p.slug === slug);
  const mdxContent = await parseMDX(post.content);

  return {
    props: {
      post,
      mdxContent,
      slug,
      posts,
    },
  };
};

export default Article;
