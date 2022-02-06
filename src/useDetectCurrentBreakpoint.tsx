import { useMemo } from 'react';

import type {
  BreakpointKey,
  Breakpoints,
  BreakpointUnit,
  WindowSize,
} from './breakpoints';

import { convertScreenWidth } from './helpers/convertScreenWidth';
import { calculateBreakpoint } from './helpers/calculateBreakpoint';

export interface BreakpointDetectionOptions<
  K extends BreakpointKey = BreakpointKey,
> {
  screenSize: WindowSize;
  breakpoints: Breakpoints<K>;
  breakpointUnit: BreakpointUnit;
  guessedBreakpoint: number;
  defaultBreakpoint: number;
}

/**
 * Detect the the current breakpoint by window size
 * @private for internal use
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
    if (screenSize.width) {
      // if we are on the client, we directly compose the breakpoint using window width
      const screenWidth = convertScreenWidth(screenSize.width, breakpointUnit);
      return calculateBreakpoint(screenWidth, breakpoints);
    } else if (guessedBreakpoint) {
      // use the breakpoint provided by SSR on server
      return calculateBreakpoint(guessedBreakpoint, breakpoints);
    } else {
      // use default breakpoint if no breakpoint from server is available
      return calculateBreakpoint(defaultBreakpoint, breakpoints);
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
