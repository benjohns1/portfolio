import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const HighlightedCode = ({ heading, children, language }) => {
  const headingPart = (heading) ? <pre className="p-2 pb-3 -mb-8 bg-zinc-900 text-zinc-400 rounded-t-lg text-sm">{heading}</pre> : "";
  return (
    <div>
      {headingPart}
      <SyntaxHighlighter language={language} style={a11yDark}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default HighlightedCode;
