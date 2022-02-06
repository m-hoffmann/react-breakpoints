import type { Breakpoints } from '../breakpoints';
import { sortBreakpoints } from './sortBreakpoints';

/**
 * Get smallest breakpoint key
 */
export function getSmallestBreakpoint(breakpoints: Breakpoints): string {
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  return sortedBreakpoints[sortedBreakpoints.length - 1].name;
}
