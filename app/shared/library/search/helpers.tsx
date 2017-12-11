import * as React from 'react';

export const formatSearchText = (fullText: string, searchTerm: string) => {
  if (!fullText) return null;
  const startIdx = fullText.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (!searchTerm || startIdx < 0) return fullText;

  const endIdx = startIdx + searchTerm.length - 1;

  const formattedText: Array<JSX.Element | string> = [];

  fullText.split('').map((char, i) => {
    if (i >= startIdx && i <= endIdx) {
      formattedText.push(<span key={i}>{char}</span>);
    } else {
      formattedText.push(char);
    }
  });

  return formattedText;
};
