import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const HighlightedCode = ({ heading, children, language }) => {
  const headingPart = (heading) ? <h6>{heading}</h6> : "";
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
