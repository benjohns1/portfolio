import config from "@config/config.json";
import { dateFormat } from "@lib/utils/dateFormat";
import Link from "next/link";
const { blog_folder, default_image } = config.settings;

const Post = ({ post, className }) => {
  let image = {
    url: post.frontmatter.image_sm ?? post.frontmatter.image,
    bgColor: post.frontmatter.image_bg_color ?? 'transparent',
    bgSize: post.frontmatter.image_size ?? 'cover'
  };
  if (!image.url) {
    image.url = default_image.url;
    image.bgColor = post.frontmatter.image_bg_color ?? default_image.bg_color ?? 'transparent';
    image.bgSize = post.frontmatter.image_size ?? default_image.bg_size ?? 'cover';
  }
  const imageRemSize = 9;
  const imageRemMargin = 2;
  const imageStyle = {
    backgroundImage: 'url('+image.url+')',
    overflow: 'hidden',
    borderRadius: '1rem',
    backgroundColor: image.bgColor,
    backgroundSize: image.bgSize,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: `${imageRemSize}rem`,
    height: `${imageRemSize}rem`,
    margin: `0 ${imageRemMargin}rem ${imageRemMargin}rem 0`,
  }
  return (
    <div className={className}>
      <div className="card">
        <div className="float-left"><Link href={`/${blog_folder}/${post.slug}`}><div style={imageStyle}></div></Link></div>
        <div style={{marginLeft: `${imageRemSize+imageRemMargin}rem`}}>
          <h2 className="h3 font-normal">
            <Link href={`/${blog_folder}/${post.slug}`} className="block">
              {post.frontmatter.title}
            </Link>
          </h2>
          <p className="mb-2">{dateFormat(post.frontmatter.date)}</p>
          <p className="my-2">{post.frontmatter.summary}</p>
        </div>
        <div className="clear-both">
          <ul className="flex items-center space-x-4 float-left">
            {post.frontmatter.categories.map((category, index) => (
              <li key={index}>
                <Link
                  className="text-primary"
                  href={`/categories/${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="btn-link inline-flex items-center hover:text-primary float-right"
            href={`/${blog_folder}/${post.slug}`}
          >
            Continue Reading
            <svg
              className="ml-1"
              width="22"
              height="11"
              viewBox="0 0 16 8"
              fill="currentcolor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.3536 4.35355c.1952-.19526.1952-.51184.0-.7071L12.1716.464467C11.9763.269205 11.6597.269205 11.4645.464467c-.1953.195262-.1953.511845.0.707103L14.2929 4 11.4645 6.82843c-.1953.19526-.1953.51184.0.7071C11.6597 7.7308 11.9763 7.7308 12.1716 7.53553l3.182-3.18198zM-.437114e-7 4.5H15v-1H.437114e-7l-.874228e-7 1z"></path>
            </svg>
          </Link>
          <div className="clear-both"></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
