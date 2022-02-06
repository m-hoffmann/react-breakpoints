import type {
  BreakpointMap,
  BreakpointUnit,
  BreakpointQuery,
} from '../breakpoints';

import { sortBreakpoints } from './sortBreakpoints';

function minWidth(value: number, unit: BreakpointUnit): string {
  return `(min-width: ${value}${unit})`;
}

function maxWidth(value: number, unit: BreakpointUnit): string {
  return `(max-width: ${value}${unit})`;
}

/**
 * Creates sorted array of breakpoints sorted by descending order
 * @param breakpoints
 * @param breakpointUnit
 * @returns
 */
export function createBreakpointQueryArray(
  breakpoints: BreakpointMap,
  breakpointUnit: BreakpointUnit,
): BreakpointQuery[] {
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  const queryArray: BreakpointQuery[] = sortedBreakpoints.map(
    (breakpoint, breakpointIndex) => {
      const smallerBreakpoint = sortedBreakpoints[breakpointIndex + 1];
      const largerBreakpoint = sortedBreakpoints[breakpointIndex - 1];
      const queries: string[] = [];

      if (smallerBreakpoint != null) {
        // larger than the current one
        queries.push(minWidth(breakpoint.width, breakpointUnit));
      }

      if (largerBreakpoint != null) {
        // smaller than the larger one
        queries.push(maxWidth(largerBreakpoint.width, breakpointUnit));
      }

      // if there is no previous and no next
      // then there is a single breakpoint that matches
      if (queries.length === 0) {
        // we need to use all, empty string fails on some browsers
        queries.push('all');
      }

      return {
        name: breakpoint.name,
        width: breakpoint.width,
        query: queries.join(' and '),
      };
    },
  );

  return queryArray as BreakpointQuery[];
}
