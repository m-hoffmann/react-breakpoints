import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { BreakpointUnit } from './breakpoints';

import { BreakpointKey, BreakpointMap } from './breakpoints';
import { sortBreakpoints } from './utils';
import { createBreakpointQueryArray } from './media-utils';

import {
  createMediaQueryListener,
  MediaQueryListener,
} from './MediaQueryListener';

/* istanbul ignore next */
const globalWindow = typeof window !== 'undefined' ? window : null;

export interface MatchMediaBreakpointsProps<K extends BreakpointKey> {
  breakpoints: BreakpointMap<K>;
  breakpointUnit: BreakpointUnit;
  defaultBreakpoint?: K;
}

function findLargestMatchingBreakpoint(
  breakpoints: Record<string, number>,
  matchedBreakpoints: Record<string, boolean>,
  defaultBreakpoint = '',
) {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  if (sortedBreakpoints.length === 0) {
    throw new Error('There must be at least one breakpoint');
  }

  // flag matching breakpoints
  for (const item of sortedBreakpoints) {
    const [name] = item;
    if (matchedBreakpoints[name]) {
      return name;
    }
  }

  if (defaultBreakpoint) {
    return defaultBreakpoint;
  }

  // if no match is found, take the smallest one
  return sortedBreakpoints[sortedBreakpoints.length - 1][0];
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
      props.defaultBreakpoint,
    );

    setCurrentBreakpoint(match);
  }, [props.breakpoints, props.defaultBreakpoint]);

  // The current matching breakpoint, the return value of the hook
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    findLargestMatchingBreakpoint(
      props.breakpoints,
      matchedBreakpoints.current,
      props.defaultBreakpoint,
    ),
  );

  useLayoutEffect(() => {
    const listeners: MediaQueryListener[] = [];

    // reset the ref
    matchedBreakpoints.current = {};

    if (globalWindow && typeof globalWindow.matchMedia === 'function') {
      const queries = createBreakpointQueryArray(
        props.breakpoints,
        props.breakpointUnit,
      );
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
    props.breakpointUnit,
    props.breakpoints,
    props.defaultBreakpoint,
    computeNewBreakpoint,
    updateBreakpointMatch,
  ]);

  return currentBreakpoint as K;
}
