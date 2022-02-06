import type { BreakpointMap } from '../breakpoints';
import { sortBreakpoints } from '../helpers/sortBreakpoints';

/** Calculate breakpoint by width */
export function calculateBreakpoint(
  screenWidth: number,
  breakpoints: BreakpointMap,
): string {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  for (const b of sortedBreakpoints) {
    if (screenWidth >= b.width) {
      return b.name;
    }
  }

  // screenWidth is below lowest breakpoint,
  // so it will still be set to equal lowest breakpoint instead of null
  return sortedBreakpoints[sortedBreakpoints.length - 1].name;
}
