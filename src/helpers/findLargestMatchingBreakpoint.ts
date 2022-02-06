import { sortBreakpoints } from './sortBreakpoints';

export function findLargestMatchingBreakpoint(
  breakpoints: Record<string, number>,
  matchedBreakpoints: Record<string, boolean>,
  defaultBreakpoint: string,
) {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  // flag matching breakpoints
  for (const breakpoint of sortedBreakpoints) {
    if (matchedBreakpoints[breakpoint.name]) {
      return breakpoint.name;
    }
  }

  return defaultBreakpoint;
}
