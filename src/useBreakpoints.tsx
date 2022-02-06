import { useContext } from 'react';

import { BreakpointsContext } from './BreakpointsContext';
import type { BreakpointsProps, BreakpointKey } from './breakpoints';

/**
 * Access breakpoints computed by `ReactBreakpoints`
 *
 * Needs provider for `BreakpointsProps`
 * @returns The breakpoint props
 */
export function useBreakpoints<
  K extends BreakpointKey = BreakpointKey,
>(): BreakpointsProps<K> {
  return useContext(BreakpointsContext) as BreakpointsProps<K>;
}
