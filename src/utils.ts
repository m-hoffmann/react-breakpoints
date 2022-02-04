import { ERRORS } from './messages';

import {
  BreakpointMap,
  BreakpointUnit,
  SortedBreakpoints,
} from './breakpoints';

export function calculateBreakpoint(
  screenWidth: number,
  breakpoints: SortedBreakpoints,
): string {
  for (const b of breakpoints) {
    if (screenWidth >= b[1]) {
      return b[0];
    }
  }
  // screenWidth is below lowest breakpoint,
  // so it will still be set to equal lowest breakpoint instead of null
  return breakpoints[breakpoints.length - 1][0];
}

/**
 * Sort from largest to smallest
 */
export function sortBreakpoints(breakpoints: BreakpointMap): SortedBreakpoints {
  return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
}

/**
 * Get smallest breakpoint key
 */
export function getSmallestBreakpoint(breakpoints: BreakpointMap): string {
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  return sortedBreakpoints[sortedBreakpoints.length - 1][0];
}

export function convertScreenWidth(
  screenWidth: number,
  breakpointUnit: BreakpointUnit,
): number {
  return breakpointUnit === 'em' ? screenWidth / 16 : screenWidth;
}

/**
 * Throw Error if no breakpoints were passed
 * @param breakpoints
 */
export function validateBreakpoints(breakpoints: BreakpointMap): void {
  // throw Error if no breakpoints were passed
  if (!breakpoints) {
    throw new Error(ERRORS.NO_BREAKPOINTS);
  }

  // throw Error if breakpoints is not an object
  if (typeof breakpoints !== 'object') {
    throw new Error(ERRORS.NOT_OBJECT);
  }

  // throw Error if breakpoints has no properties
  if (Object.keys(breakpoints).length === 0) {
    throw new Error(ERRORS.EMPTY_OBJECT);
  }
}
