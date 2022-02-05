import type { BreakpointMap, SortedBreakpoints } from '../breakpoints';

/**
 * Sort from largest to smallest
 */
export function sortBreakpoints(breakpoints: BreakpointMap): SortedBreakpoints {
  return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
}
