import { useState, useLayoutEffect } from 'react';
import debounce from 'lodash.debounce';

import type { WindowSize } from './breakpoints';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

/**
 * Detects screen size from window object
 * @param ignoreScreenSize
 * @returns
 */
function detectScreenSize(ignoreScreenSize: boolean): WindowSize {
  if (!globalWindow || ignoreScreenSize) {
    return { width: 0, height: 0 };
  } else {
    return { width: globalWindow.innerWidth, height: globalWindow.innerHeight };
  }
}

/**
 * Detection options for window width
 */
export interface WindowSizeDetectionOptions {
  debounceResize?: boolean;
  debounceDelay?: number;
  ignoreScreenSize?: boolean;
}

/**
 * Encapsulates detection of window dimensions
 * @param props
 * @returns Screen with in pixels
 */
export function useDetectWindowSize(props: WindowSizeDetectionOptions): WindowSize {
  const {
    debounceResize = false,
    debounceDelay = 50,
    ignoreScreenSize = !globalWindow,
  } = props;

  // screen width in px
  const [screenSize, setScreenSize] = useState<WindowSize>(() =>
    detectScreenSize(ignoreScreenSize),
  );

  useLayoutEffect(
    function screenResizeEffect() {
      function updateScreenSize() {
        setScreenSize(detectScreenSize(ignoreScreenSize));
      }

      const resizeHandler = debounceResize
        ? debounce(updateScreenSize, debounceDelay)
        : updateScreenSize;

      const orientationHandler = updateScreenSize;

      // add event listeners for screen events
      if (globalWindow) {
        globalWindow.addEventListener('resize', resizeHandler);
        globalWindow.addEventListener('orientationchange', orientationHandler);
      }

      // cleanup effect: remove all event listeners
      return () => {
        if (globalWindow) {
          globalWindow.removeEventListener('resize', resizeHandler);
          globalWindow.removeEventListener(
            'orientationchange',
            orientationHandler,
          );
        }
      };
    },
    [ignoreScreenSize, debounceResize, debounceDelay],
  );

  return screenSize;
}
