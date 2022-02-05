import { useMemo } from 'react';

import type {
  BreakpointKey,
  BreakpointMap,
  BreakpointUnit,
  ScreenSize,
} from './breakpoints';

import { sortBreakpoints } from './helpers/sortBreakpoints';
import { convertScreenWidth } from './helpers/convertScreenWidth';
import { calculateBreakpoint } from './helpers/calculateBreakpoint';

export interface BreakpointDetectionOptions<
  K extends BreakpointKey = BreakpointKey,
> {
  screenSize: ScreenSize;
  breakpoints: BreakpointMap<K>;
  breakpointUnit: BreakpointUnit;
  guessedBreakpoint: number;
  defaultBreakpoint: number;
}

/**
 * Detect the the current breakpoint
 */
export function useDetectCurrentBreakpoint<
  K extends BreakpointKey = BreakpointKey,
>(options: BreakpointDetectionOptions<K>) {
  const {
    breakpoints,
    breakpointUnit,
    guessedBreakpoint,
    defaultBreakpoint,
    screenSize,
  } = options;

  const currentBreakpoint = useMemo<string>(() => {
    const sortedBreakpoints = sortBreakpoints(breakpoints);

    if (screenSize.width) {
      // if we are on the client, we directly compose the breakpoint using window width
      const screenWidth = convertScreenWidth(screenSize.width, breakpointUnit);
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
    breakpoints,
    screenSize,
  ]);

  return currentBreakpoint;
}
