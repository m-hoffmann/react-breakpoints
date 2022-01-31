import { useState, useLayoutEffect } from 'react';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

/**
 * Might not work on older browsers
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 * @param mediaQuery '(max-width: 600px)'
 * @return
 */
export function useMatchMediaQuery(mediaQuery: string) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    let mediaQueryList: MediaQueryList;

    const listener = function (ev: MediaQueryListEvent) {
      setMatches(ev.matches);
    };

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      mediaQueryList = globalWindow.matchMedia(mediaQuery);
      setMatches(mediaQueryList.matches);

      if (typeof mediaQueryList.addEventListener === 'function') {
        mediaQueryList.addEventListener('change', listener);
      }
    }

    return () => {
      if (mediaQueryList != null) {
        if (typeof mediaQueryList.removeEventListener === 'function') {
          mediaQueryList.removeEventListener('change', listener);
        }
      }
    };
  }, [mediaQuery]);

  return matches;
}
