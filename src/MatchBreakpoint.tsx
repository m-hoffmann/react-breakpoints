import { ReactNode, Fragment } from 'react';

import { useBreakpoints } from './useBreakpoints';
import { BreakpointKey } from './breakpoints';

/**
 * Children and conditions
 * 
 * Needs provider for `BreakpointsProps`
 */
export interface MatchBreakpointProps<K extends BreakpointKey = BreakpointKey> {
  /**
   * Children are rendered if the conditions are met
   */
  children: ReactNode;
  /**
   * Current breakpoint >= min
   */
  min?: K;
  /**
   * Current Breakpoint < max
   */
  max?: K;
  /**
   * Current breakpoint is not
   */
  not?: K;
  /**
   * Current breakpoint is
   */
  is?: K;
}

/**
 * Renders children if conditions are met
 */
export function MatchBreakpoint<K extends BreakpointKey = BreakpointKey>(
  props: MatchBreakpointProps<K>,
): JSX.Element {
  const { currentBreakpoint, breakpoints } = useBreakpoints();

  if (props.is != null && currentBreakpoint !== props.is) {
    return <Fragment />;
  }

  if (props.not != null && currentBreakpoint === props.not) {
    return <Fragment />;
  }

  if (
    props.min != null &&
    breakpoints[currentBreakpoint] < breakpoints[props.min]
  ) {
    return <Fragment />;
  }

  if (
    props.max != null &&
    breakpoints[currentBreakpoint] >= breakpoints[props.max]
  ) {
    return <Fragment />;
  }

  return <Fragment>{props.children}</Fragment>;
}
