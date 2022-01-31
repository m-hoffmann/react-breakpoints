import { BreakpointsContext } from './BreakpointsContext';
import { BreakpointsProps, BreakpointKey } from './breakpoints';
import { useContext } from 'react';

/**
 * Access breakpoints computed by `ReactBreakpoints`
 *
 * Needs `ReactBreakpoints` in parent react tree
 * @returns The breakpoint props
 */
export function useBreakpoints<
  K extends BreakpointKey = BreakpointKey,
>(): BreakpointsProps<K> {
  return useContext(BreakpointsContext) as BreakpointsProps<K>;
}
