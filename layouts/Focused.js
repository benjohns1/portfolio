import { MDXRemote } from "next-mdx-remote";
import shortcodes from "./shortcodes/all";
import {markdownify} from "@lib/utils/textConverter";

const Focused = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title } = frontmatter;
  return (
    <section className="section pt-[72px]">
      <div className="container">
        <div className="row">
          <div className="mx-auto lg:col-8">
            <div className="mt-12 pt-12">
              {markdownify(title, "h1", "h1")}
            </div>
            <div className="content">
              {<MDXRemote {...mdxContent} components={shortcodes} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Focused;
