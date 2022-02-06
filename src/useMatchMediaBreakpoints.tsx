import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { BreakpointUnit } from './breakpoints';

import type { BreakpointKey, BreakpointMap } from './breakpoints';
import { getSmallestBreakpoint } from './helpers/getSmallestBreakpoint';
import { findLargestMatchingBreakpoint } from './helpers/findLargestMatchingBreakpoint';
import { createBreakpointQueryArray } from './helpers/createBreakpointQueryArray';

import type { MediaQueryListener } from './MediaQueryListener';
import { createMediaQueryListener } from './MediaQueryListener';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

export interface MatchMediaBreakpointsProps<K extends BreakpointKey> {
  breakpoints: BreakpointMap<K>;
  breakpointUnit: BreakpointUnit;
  defaultBreakpoint?: K;
}

/**
 * Might not work on older browsers
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
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

  useLayoutEffect(() => {
    const listeners: MediaQueryListener[] = [];

    // reset the ref
    matchedBreakpoints.current = {};

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      const queries = createBreakpointQueryArray(breakpoints, breakpointUnit);
      queries.forEach(([breakpoint, mediaQuery]) => {
        const mediaQueryList = globalWindow.matchMedia(mediaQuery);

        // set initial match
        updateBreakpointMatch(breakpoint, mediaQueryList.matches);

        // update matches
        listeners.push(
          createMediaQueryListener(mediaQueryList, ev => {
            updateBreakpointMatch(breakpoint, ev.matches);
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
