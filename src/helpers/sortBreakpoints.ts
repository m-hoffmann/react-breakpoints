import type { Breakpoints, BreakpointSize } from '../breakpoints';

/**
 * Sorts breakpoints
 * @param breakpoints
 * @param order default is "desc"
 * @returns
 */
export function sortBreakpoints(
  breakpoints: Breakpoints,
  order: 'asc' | 'desc' = 'desc',
): BreakpointSize[] {
  const sign = order === 'asc' ? -1 : 1;
  const entries = Object.entries(breakpoints);
  const entriesAsObject = entries.map(([name, width]) => ({ name, width }));
  return entriesAsObject.sort((a, b) => sign * (b.width - a.width));
}
