import { sortBreakpoints } from './sortBreakpoints';

export function findLargestMatchingBreakpoint(
  breakpoints: Record<string, number>,
  matchedBreakpoints: Record<string, boolean>,
  defaultBreakpoint: string,
) {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  // flag matching breakpoints
  for (const item of sortedBreakpoints) {
    const [name] = item;
    if (matchedBreakpoints[name]) {
      return name;
    }
  }

  return defaultBreakpoint;
}
