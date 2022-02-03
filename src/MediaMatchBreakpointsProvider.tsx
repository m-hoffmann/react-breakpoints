import React, { ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types';

import { BreakpointsContext } from './BreakpointsContext';
import { useMatchMediaBreakpoints } from './useMatchMediaBreakpoints';

import { ERRORS } from './messages';

import {
  BreakpointKey,
  BreakpointMap,
  BreakpointsProps,
  BreakpointUnit,
} from './breakpoints';

/**
 * Props for ReactBreakpoints
 */
export interface MediaMatchBreakpointsProviderProps<
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
 * Provides the breakpoints for
 * - `Media` Component
 * - `withBreakpoints`
 * - `useBreakpoints`
 */
export function MediaMatchBreakpointsProvider<
  K extends BreakpointKey = BreakpointKey,
>(props: MediaMatchBreakpointsProviderProps<K>) {
  const {
    children,
    breakpoints,
    breakpointUnit = 'px',
    defaultBreakpoint,
  } = props;

  // throw Error if no breakpoints were passed
  if (!breakpoints) {
    throw new Error(ERRORS.NO_BREAKPOINTS);
  }

  // throw Error if breakpoints is not an object
  if (typeof breakpoints !== 'object') {
    throw new Error(ERRORS.NOT_OBJECT);
  }

  const currentBreakpoint = useMatchMediaBreakpoints({
    breakpoints,
    breakpointUnit,
    defaultBreakpoint,
  });

  const contextProps = useMemo<BreakpointsProps>(() => {
    return {
      breakpoints,
      currentBreakpoint,
      screenWidth: 0,
    };
  }, [breakpoints, currentBreakpoint]);

  return (
    <BreakpointsContext.Provider value={contextProps}>
      {children}
    </BreakpointsContext.Provider>
  );
}

MediaMatchBreakpointsProvider.propTypes = {
  breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
  breakpointUnit: PropTypes.oneOf(['px', 'em']),
  defaultBreakpoint: PropTypes.string,
};
