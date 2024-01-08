export const similarPosts = (categories, posts, slug) => {
  return posts.filter((post) => {
    if (post.slug === slug) {
      return false;
    }
    return categories.find((category) =>
      post.frontmatter.categories.includes(category)
    );
  });
};
