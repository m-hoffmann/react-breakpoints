import type { BreakpointMap, BreakpointUnit } from '../breakpoints';

import { createBreakpointQueryArray } from './createBreakpointQueryArray';

/**
 * Map the breakpoints to an object
 * @private for internal use
 * @param breakpoints
 * @param breakpointUnit
 * @returns
 */
export function createBreakpointQueryObject(
  breakpoints: BreakpointMap,
  breakpointUnit: BreakpointUnit,
): Record<string, string> {
  const queryArray = createBreakpointQueryArray(breakpoints, breakpointUnit);
  const queryObject: Record<string, string> = {};
  queryArray.forEach(value => {
    queryObject[value.name] = value.query;
  });
  return queryObject;
}
