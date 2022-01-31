import React, { ReactNode, useState, useMemo, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import {
  sortBreakpoints,
  convertScreenWidth,
  calculateBreakpoint,
} from './utils';

import { BreakpointsContext } from './BreakpointsContext';

import { ERRORS } from './messages';

import {
  BreakpointKey,
  BreakpointMap,
  BreakpointsProps,
  BreakpointUnit,
} from './breakpoints';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

function detectWindowWidth(ignoreScreenSize: boolean) {
  if (!globalWindow || ignoreScreenSize) {
    return 0;
  } else {
    return globalWindow.innerWidth;
  }
}

/**
 * Props for ReactBreakpoints
 */
export interface ReactBreakpointsProps<
  K extends BreakpointKey = BreakpointKey,
> {
  /**
   * Your breakpoints object.
   */
  breakpoints: BreakpointMap<K>;

  /**
   * The type of unit that your breakpoints should use - px or em.
   * @default "px"
   */
  breakpointUnit?: BreakpointUnit;

  /**
   * When rendering on the server, you can do your own magic with for example UA
   * to guess which viewport width a user probably has.
   */
  guessedBreakpoint?: number;

  /**
   * In case you don't want to default to mobile on SSR and no guessedBreakpoint
   * is passed, use defaultBreakpoint to set your own value.
   */
  defaultBreakpoint?: number;

  /**
   * If you don't want the resize listener to be debounced, set to false.
   * @default false
   */

  debounceResize?: boolean;

  /**
   * Set a custom delay for how long the debounce timeout should be.
   * @default 50
   */
  debounceDelay?: number;

  /**
   * Do not use screen size for calculation of breakpoints
   * but use guessedBreakpoint or defaultBreakpoint
   *
   * Used for simulation of SSR in tests
   * @default false
   * @private Don't use this in your application
   */
  ignoreScreenSize?: boolean;

  /**
   * Children props
   */
  children?: ReactNode;
}

/**
 * Provides the breakpoints for
 * - `Media` Component
 * - `withBreakpoints`
 * - `useBreakpoints`
 */
export function ReactBreakpoints<K extends BreakpointKey = BreakpointKey>(
  props: ReactBreakpointsProps<K>,
) {
  const {
    children,
    breakpoints,
    breakpointUnit = 'px',
    debounceResize = false,
    debounceDelay = 50,
    ignoreScreenSize = !globalWindow,
    guessedBreakpoint,
    defaultBreakpoint = 0,
  } = props;

  // throw Error if no breakpoints were passed
  if (!breakpoints) {
    throw new Error(ERRORS.NO_BREAKPOINTS);
  }

  // throw Error if breakpoints is not an object
  if (typeof breakpoints !== 'object') {
    throw new Error(ERRORS.NOT_OBJECT);
  }

  // screen width in px
  const [screenWidthPx, setScreenWidthPx] = useState<number>(() => {
    return detectWindowWidth(ignoreScreenSize);
  });

  const currentBreakpoint = useMemo<string>(() => {
    const sortedBreakpoints = sortBreakpoints(breakpoints);

    if (!ignoreScreenSize) {
      // if we are on the client, we directly compose the breakpoint using window width
      const screenWidth = convertScreenWidth(screenWidthPx, breakpointUnit);
      return calculateBreakpoint(screenWidth, sortedBreakpoints);
    } else if (guessedBreakpoint) {
      // use the breakpoint provided by SSR on server
      return calculateBreakpoint(guessedBreakpoint, sortedBreakpoints);
    } else {
      // use default breakpoint if no breakpoint from server is available
      return calculateBreakpoint(defaultBreakpoint, sortedBreakpoints);
    }
  }, [
    breakpointUnit,
    defaultBreakpoint,
    guessedBreakpoint,
    ignoreScreenSize,
    screenWidthPx,
    breakpoints,
  ]);

  useLayoutEffect(
    function screenResizeEffect() {
      function updateScreenSize() {
        const windowWidth = detectWindowWidth(ignoreScreenSize);
        setScreenWidthPx(windowWidth);
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

  const contextProps = useMemo<BreakpointsProps>(() => {
    return {
      breakpoints,
      currentBreakpoint,
      screenWidth: convertScreenWidth(screenWidthPx, breakpointUnit),
    };
  }, [breakpoints, currentBreakpoint, screenWidthPx, breakpointUnit]);

  return (
    <BreakpointsContext.Provider value={contextProps}>
      {children}
    </BreakpointsContext.Provider>
  );
}

ReactBreakpoints.propTypes = {
  breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
  breakpointUnit: PropTypes.oneOf(['px', 'em']),
  guessedBreakpoint: PropTypes.number,
  defaultBreakpoint: PropTypes.number,
  debounceResize: PropTypes.bool,
  debounceDelay: PropTypes.number,
};
