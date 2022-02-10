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
   * @example "desktop"
   */
  min?: K;
  /**
   * Current Breakpoint <= max
   * @example "mobile"
   */
  max?: K;
  /**
   * Current breakpoint is not
   * @example "desktop"
   * @example ["desktop", "tablet"]
   */
  not?: K | K[];
  /**
   * Current breakpoint is
   * @example "desktop"
   * @example ["desktop", "tablet"]
   */
  is?: K | K[];
}

/**
 * Renders children if conditions are met
 */
export function MatchBreakpoint<K extends BreakpointKey = BreakpointKey>(
  props: MatchBreakpointProps<K>,
): JSX.Element {
  const { currentBreakpoint, breakpoints } = useBreakpoints<K>();

  if (props.is != null) {
    if (Array.isArray(props.is)) {
      if (props.is.indexOf(currentBreakpoint) < 0) {
        return <Fragment />;
      }
    } else {
      if (currentBreakpoint !== props.is) {
        return <Fragment />;
      }
    }
  }

  if (props.not != null) {
    if (Array.isArray(props.not)) {
      if (props.not.indexOf(currentBreakpoint) >= 0) {
        return <Fragment />;
      }
    } else {
      if (currentBreakpoint === props.not) {
        return <Fragment />;
      }
    }
  }

  if (props.min != null) {
    if (breakpoints[currentBreakpoint] < breakpoints[props.min]) {
      return <Fragment />;
    }
  }

  if (props.max != null) {
    if (breakpoints[currentBreakpoint] > breakpoints[props.max]) {
      return <Fragment />;
    }
  }

  return <Fragment>{props.children}</Fragment>;
}
