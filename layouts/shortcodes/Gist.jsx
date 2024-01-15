import React from "react";

class Gist extends React.PureComponent {

  componentDidMount() {
    this.updateContent();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateContent();
  }

  id(src, id) {
    id = id ?? 0;
    return src.replace('https://', '').replace(/\W/g, '-') + '-' + id;
  }

  updateContent() {
    const { src, id } = this.props;

    const iframe = this.iframeNode;

    let doc = iframe.document;
    if (iframe.contentDocument) doc = iframe.contentDocument;
    else if (iframe.contentWindow) doc = iframe.contentWindow.document;

    const gistScript = `<script type="text/javascript" src="${src}"></script>`;
    const resizeScript = `onload="parent.document.getElementById('${this.id(src, id)}').style.height=document.body.scrollHeight + 25 + 'px'"`;
    const iframeHtml = `<html><head><base target="_parent"></head><body ${resizeScript}>${gistScript}</body></html>`;

    doc.open();
    doc.writeln(iframeHtml);
    doc.close();
  }

  render() {
    const { src, id } = this.props;
    return (
      <iframe
        ref={(n) => {
          this.iframeNode = n;
        }}
        width="100%"
        frameBorder={0}
        id={this.id(src, id)}
      />
    );

  }
}

export default Gist;
