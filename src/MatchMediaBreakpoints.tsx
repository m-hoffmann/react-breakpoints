import { ReactNode, useMemo } from 'react';
import { objectOf, oneOf, number, string } from 'prop-types';

import { BreakpointsContext } from './BreakpointsContext';
import { useMatchMediaBreakpoints } from './useMatchMediaBreakpoints';
import { validateBreakpoints } from './helpers/validateBreakpoints';

import {
  BreakpointKey,
  BreakpointMap,
  BreakpointsProps,
  BreakpointUnit,
} from './breakpoints';

/**
 * Props for ReactBreakpoints
 */
export interface MatchMediaBreakpointsProps<
  K extends BreakpointKey = BreakpointKey,
> {
  /**
   * Your breakpoints object.
   */
  breakpoints: BreakpointMap<K>;

  /**
   * The type of unit that your breakpoints should use - px or em.
   * @default "px"
   */
  breakpointUnit?: BreakpointUnit;

  /**
   * Default breakpoint that is used
   * if no breakpoint matches
   *
   * Defaults to smallest breakpoint if not set
   */
  defaultBreakpoint?: K;

  /**
   * Children props
   */
  children?: ReactNode;
}

/**
 * Provides the breakpoints for the Consumer components
 * using `window.matchMedia`
 */
export function MatchMediaBreakpoints<K extends BreakpointKey = BreakpointKey>(
  props: MatchMediaBreakpointsProps<K>,
) {
  validateBreakpoints(props.breakpoints);

  const {
    children,
    breakpoints,
    breakpointUnit = 'px',
    defaultBreakpoint,
  } = props;

  const currentBreakpoint = useMatchMediaBreakpoints({
    breakpoints,
    breakpointUnit,
    defaultBreakpoint,
  });

  const contextProps = useMemo<BreakpointsProps>(() => {
    return {
      breakpoints,
      currentBreakpoint,
    };
  }, [breakpoints, currentBreakpoint]);

  return (
    <BreakpointsContext.Provider value={contextProps}>
      {children}
    </BreakpointsContext.Provider>
  );
}

MatchMediaBreakpoints.propTypes = {
  breakpoints: objectOf(number).isRequired,
  breakpointUnit: oneOf(['px', 'em']),
  defaultBreakpoint: string,
};
