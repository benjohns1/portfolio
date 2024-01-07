export const sortByDate = (array) => {
  const sortedArray = array.sort(
    (a, b) =>
      new Date(b.frontmatter.date) -
      new Date(a.frontmatter.date)
  );
  return sortedArray;
};

export const sortByWeight = (array) => {
  const withWeight = array.filter((item) => item.frontmatter.weight);
  const withoutWeight = array.filter((item) => !item.frontmatter.weight);
  const sortedWeightedArray = withWeight.sort(
    (a, b) => a.frontmatter.weight - b.frontmatter.weight
  );
  const sortedArray = [...new Set([...sortedWeightedArray, ...withoutWeight])];
  return sortedArray;
};
