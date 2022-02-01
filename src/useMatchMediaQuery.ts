import { useState, useLayoutEffect } from 'react';

import { MediaQueryListener } from './MediaQueryListener';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

/**
 * Might not work on older browsers
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 * @param mediaQuery '(max-width: 600px)'
 * @return
 */
export function useMatchMediaQuery(mediaQuery: string): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const listeners: MediaQueryListener[] = [];

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      const mediaQueryList = globalWindow.matchMedia(mediaQuery);

      // flag initial match
      setMatches(mediaQueryList.matches);

      // listene for changes
      listeners.push(
        new MediaQueryListener(mediaQueryList, ev => {
          setMatches(ev.matches);
        }),
      );
    }

    return () => {
      // if no window exists, then no listeners will have been added
      for (const listener of listeners) {
        listener.detach();
      }
    };
  }, [mediaQuery]);

  return matches;
}
