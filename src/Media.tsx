import type { BreakpointKey, BreakpointsProps } from './breakpoints';
import { useBreakpoints } from './useBreakpoints';

/**
 * Props for Media Component
 *
 */
export interface MediaProps<K extends BreakpointKey> {
  children(value: BreakpointsProps<K>): JSX.Element;
}

/**
 * Passes the `BreakpointsProps` to its children
 *
 * Needs provider for `BreakpointsProps`
 *
 * @example
 * <Media>
 *  {({ currentBreakpoint }) => currentBreakpoint === "desktop" && <div />}
 * </Media>
 */
export function Media<K extends BreakpointKey = BreakpointKey>(
  props: MediaProps<K>,
): JSX.Element {
  const breakpoints = useBreakpoints<K>();
  return props.children(breakpoints);
}
