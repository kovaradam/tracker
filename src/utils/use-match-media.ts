import { useState, useEffect } from 'react';

const useMatchMedia = (query: string): boolean => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    function listener(): void {
      setMatches(media.matches);
    }
    media.onchange = listener;
    return (): void => {
      media.onchange = null;
    };
  }, [query, matches]);

  return matches;
};

export default useMatchMedia;
