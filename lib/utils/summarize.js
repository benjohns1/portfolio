export const summarize = (text, wordLength) => {
  return text.split(/\s+/).slice(0, wordLength).join(' ') + '...';
}
