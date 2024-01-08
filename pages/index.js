import fs from "fs";
import config from "@config/config.json";
import social from "@config/social.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/components/Post";
import Social from "@layouts/components/Social";
import { getPages } from "@lib/contentParser";
import { generateRssFeed } from "@lib/utils/generateRssFeeds";
import { byDate } from "@lib/utils/sort";
import { markdownify } from "@lib/utils/textConverter";
const { blog_folder } = config.settings;

const Home = ({ posts }) => {
  const { pagination } = config.settings;
  const { name, image, designation, bio } = config.profile;
  const sortPostByDate = byDate(posts);

  return (
    <Base>
      {/* profile */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto text-center lg:col-8">
              <ImageFallback
                className="mx-auto rounded-full"
                src={image}
                width={220}
                height={220}
                priority={true}
                alt={name}
              />
              {markdownify(
                name,
                "h1",
                "mt-12 text-6xl lg:text-8xl font-semibold"
              )}
              {markdownify(designation, "p", "mt-6 text-primary text-xl")}
              {markdownify(bio, "p", "mt-4 leading-9 text-xl")}
              <Social source={social} className="profile-social-icons mt-8" />
            </div>
          </div>
        </div>
      </div>

      {/* posts */}
      <div className="pt-4">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <div className="row">
                {sortPostByDate.slice(0, pagination).map((post, i) => (
                  <Post
                    className="col-12 mb-6 md:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Pagination
              totalPages={Math.ceil(posts.length / pagination)}
              currentPage={1}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Home;

const writeRssFeeds = (feed) => {
  fs.mkdirSync("./public/feed", { recursive: true });
  fs.writeFileSync("./public/feed/rss.xml", feed.rss2());
  fs.writeFileSync("./public/feed/atom.xml", feed.atom1());
  fs.writeFileSync("./public/feed/feed.json", feed.json1());
}

// for homepage data
export const getStaticProps = async () => {
  const posts = getPages(`content/${blog_folder}`);
  const feed = await generateRssFeed(posts);
  writeRssFeeds(feed);
  return {
    props: {
      posts: posts,
    },
  };
};
