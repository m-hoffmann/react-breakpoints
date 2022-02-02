import { useRef, useState, useEffect, useCallback } from 'react';
import { BreakpointUnit } from './breakpoints';

import { BreakpointKey, BreakpointMap } from './breakpoints';
import { sortBreakpoints } from './utils';
import { minWidth, maxWidth } from './media-utils';
import { MediaQueryListener } from './MediaQueryListener';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

export interface MatchMediaBreakpointsProps<K extends BreakpointKey> {
  breakpoints: BreakpointMap<K>;
  breakpointUnit: BreakpointUnit;
}

function findLargestMatchingBreakpoint(
  breakpoints: Record<string, number>,
  matchedBreakpoints: Record<string, boolean>,
  fallbackBreakpoint = '',
) {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  if (sortedBreakpoints.length === 0) {
    throw new Error('There must be at leasdt one breakpoint');
  }

  // flag matching breakpoints
  for (const item of sortedBreakpoints) {
    const [name] = item;
    if (matchedBreakpoints[name]) {
      return name;
    }
  }

  if (fallbackBreakpoint) {
    return fallbackBreakpoint;
  }

  // if no match is found, take the smallest one
  return sortedBreakpoints[0][0];
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
  /** A ref holding the currently matched breakpoints */
  const matchedBreakpoints = useRef<Record<string, boolean>>({});

  /** Flag a breakpoint as matching */
  const updateBreakpointMatch = useCallback((id: string, matches: boolean) => {
    matchedBreakpoints.current[id] = matches;
  }, []);

  /** Computes the new breakpoint */
  const computeNewBreakpoint = useCallback(() => {
    const match = findLargestMatchingBreakpoint(
      props.breakpoints,
      matchedBreakpoints.current,
    );

    setCurrentBreakpoint(match);
  }, [props.breakpoints]);

  /** The current matching breakpoint, the return value of the hook */
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    findLargestMatchingBreakpoint(
      props.breakpoints,
      matchedBreakpoints.current,
    ),
  );

  useEffect(() => {
    const listeners: MediaQueryListener[] = [];

    // reset the ref
    matchedBreakpoints.current = {};

    const sortedBreakpoints = sortBreakpoints(props.breakpoints);

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      sortedBreakpoints.forEach((breakpoint, breakpointIndex) => {
        const smallerBreakpoint = sortedBreakpoints[breakpointIndex + 1];
        const largerBreakpoint = sortedBreakpoints[breakpointIndex - 1];

        const queries = [];

        if (smallerBreakpoint != null) {
          // larger than the current one
          queries.push(minWidth(breakpoint[1], props.breakpointUnit));
        }

        if (largerBreakpoint != null) {
          // smaller than the larger one
          queries.push(maxWidth(largerBreakpoint[1], props.breakpointUnit));
        }

        if (queries.length === 0) {
          // if there is no previous and no next, then the breakpoint matches
          return;
        }

        const mediaQuery = queries.join(' and ');

        const mediaQueryList = globalWindow.matchMedia(mediaQuery);

        // flag as matching
        updateBreakpointMatch(breakpoint[0], mediaQueryList.matches);

        listeners.push(
          new MediaQueryListener(mediaQueryList, ev => {
            updateBreakpointMatch(breakpoint[0], ev.matches); // flag matching
            computeNewBreakpoint(); // compute new breakpoint
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
    props.breakpointUnit,
    props.breakpoints,
    computeNewBreakpoint,
    updateBreakpointMatch,
  ]);

  return currentBreakpoint as K;
}
