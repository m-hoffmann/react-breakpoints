import type {
  BreakpointMap,
  BreakpointQueries,
  BreakpointUnit,
} from '../breakpoints';

import { createBreakpointQueryArray } from './createBreakpointQueryArray';

/**
 * Map the breakpoints to an object
 * @param breakpoints
 * @param breakpointUnit
 * @returns
 */
export function createBreakpointQueryObject<K extends string>(
  breakpoints: BreakpointMap<K>,
  breakpointUnit: BreakpointUnit,
): BreakpointQueries<K> {
  const queryArray = createBreakpointQueryArray<K>(breakpoints, breakpointUnit);
  const queryObject: Partial<BreakpointQueries<K>> = {};
  queryArray.forEach(value => {
    const name = value[0];
    const query = value[1];
    queryObject[name] = query;
  });
  return queryObject as BreakpointQueries<K>;
}
