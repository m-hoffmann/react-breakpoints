import type { BreakpointMap } from '../breakpoints';
import { sortBreakpoints } from './sortBreakpoints';

/**
 * Get smallest breakpoint key
 */
export function getSmallestBreakpoint(breakpoints: BreakpointMap): string {
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  return sortedBreakpoints[sortedBreakpoints.length - 1][0];
}
