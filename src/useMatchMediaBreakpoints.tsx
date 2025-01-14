import {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import { BreakpointUnit } from './breakpoints';

import type { BreakpointKey, Breakpoints } from './breakpoints';
import { getSmallestBreakpoint } from './helpers/getSmallestBreakpoint';
import { findLargestMatchingBreakpoint } from './helpers/findLargestMatchingBreakpoint';
import { createBreakpointQueryArray } from './helpers/createBreakpointQueryArray';

import type { MediaQueryListener } from './MediaQueryListener';
import { createMediaQueryListener } from './MediaQueryListener';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

const useIsomorphicLayoutEffect = globalWindow ? useLayoutEffect : useEffect;

/**
 * @private for internal use
 */
export interface MatchMediaBreakpointsProps<K extends BreakpointKey> {
  breakpoints: Breakpoints<K>;
  breakpointUnit: BreakpointUnit;
  defaultBreakpoint?: K;
}

/**
 * Detects breakpoints using media queries
 * - [matchMedia]( https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 * - [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList)
 *
 * Might not work for some older browsers
 * @private for internal use
 * @param props
 * @return
 */
export function useMatchMediaBreakpoints<K extends BreakpointKey>(
  props: MatchMediaBreakpointsProps<K>,
): K {
  const {
    breakpoints,
    breakpointUnit,
    defaultBreakpoint = getSmallestBreakpoint(breakpoints) as K,
  } = props;

  /** A ref holding the currently matched breakpoints */
  const matchedBreakpoints = useRef<Record<string, boolean>>({});

  /** Flag a breakpoint as matching */
  const updateBreakpointMatch = useCallback((id: string, matches: boolean) => {
    matchedBreakpoints.current[id] = matches;
  }, []);

  /** Computes the new breakpoint */
  const computeNewBreakpoint = useCallback(() => {
    const match = findLargestMatchingBreakpoint(
      breakpoints,
      matchedBreakpoints.current,
      defaultBreakpoint,
    );

    setCurrentBreakpoint(match);
  }, [breakpoints, defaultBreakpoint]);

  // The current matching breakpoint, the return value of the hook
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    findLargestMatchingBreakpoint(
      breakpoints,
      matchedBreakpoints.current,
      defaultBreakpoint,
    ),
  );

  useIsomorphicLayoutEffect(() => {
    const listeners: MediaQueryListener[] = [];

    // reset the ref
    matchedBreakpoints.current = {};

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      const queries = createBreakpointQueryArray(breakpoints, breakpointUnit);
      queries.forEach(({ name, query }) => {
        const mediaQueryList = globalWindow.matchMedia(query);

        // set initial match
        updateBreakpointMatch(name, mediaQueryList.matches);

        // update matches
        listeners.push(
          createMediaQueryListener(mediaQueryList, ev => {
            updateBreakpointMatch(name, ev.matches);
            computeNewBreakpoint();
          }),
        );
      });
    }

    // after we determined all matches, compute new breakpoint
    computeNewBreakpoint();

    // cleanup effects removes listeners
    return () => {
      // if no window exists, then no listeners will have been added
      for (const listener of listeners) {
        listener.detach();
      }
    };
  }, [
    breakpointUnit,
    breakpoints,
    defaultBreakpoint,
    computeNewBreakpoint,
    updateBreakpointMatch,
  ]);

  return currentBreakpoint as K;
}
