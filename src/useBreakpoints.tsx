import { BreakpointsContext } from './BreakpointsContext';
import { BreakpointsProps, BreakpointKey } from './breakpoints';
import { useContext } from 'react';

/**
 * Access props in
 * - needs ReactBreakpoints
 * @returns The breakpoint props
 */
export function useBreakpoints<K extends BreakpointKey>(): K {
  return useContext(BreakpointsContext) as unknown as K;
}
