const filterPosts = (posts, query) => {
  if (!query) {
    return posts;
  }

  return posts.filter((post) => {
    const postName = post.data.attributes.title.en.toLowerCase();
    return postName.includes(query);
  });
};

export default filterPosts;
