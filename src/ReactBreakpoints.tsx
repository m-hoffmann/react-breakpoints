import React, { ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types';

import { convertScreenWidth } from './utils';

import { BreakpointsContext } from './BreakpointsContext';

import { useScreenSize } from './useScreenSize';
import { useDetectCurrentBreakpoint } from './useDetectCurrentBreakpoint';

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
export interface ReactBreakpointsProps<
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
   * When rendering on the server, you can do your own magic with for example UA
   * to guess which viewport width a user probably has.
   */
  guessedBreakpoint?: number;

  /**
   * In case you don't want to default to mobile on SSR and no guessedBreakpoint
   * is passed, use defaultBreakpoint to set your own value.
   */
  defaultBreakpoint?: number;

  /**
   * If you don't want the resize listener to be debounced, set to false.
   * @default false
   */

  debounceResize?: boolean;

  /**
   * Set a custom delay for how long the debounce timeout should be.
   * @default 50
   */
  debounceDelay?: number;

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
export function ReactBreakpoints<K extends BreakpointKey = BreakpointKey>(
  props: ReactBreakpointsProps<K>,
) {
  const {
    children,
    breakpoints,
    breakpointUnit = 'px',
    debounceResize = false,
    debounceDelay = 50,
    guessedBreakpoint = 0,
    defaultBreakpoint = 0,
  } = props;

  // throw Error if no breakpoints were passed
  if (!breakpoints) {
    throw new Error(ERRORS.NO_BREAKPOINTS);
  }

  // throw Error if breakpoints is not an object
  if (typeof breakpoints !== 'object') {
    throw new Error(ERRORS.NOT_OBJECT);
  }

  // get the screen size in px
  const screenSize = useScreenSize({ debounceResize, debounceDelay });

  const currentBreakpoint = useDetectCurrentBreakpoint({
    breakpoints,
    breakpointUnit,
    guessedBreakpoint,
    defaultBreakpoint,
    screenSize,
  });

  const contextProps = useMemo<BreakpointsProps>(() => {
    return {
      breakpoints,
      currentBreakpoint,
      screenWidth: convertScreenWidth(screenSize.width, breakpointUnit),
    };
  }, [breakpoints, currentBreakpoint, screenSize.width, breakpointUnit]);

  return (
    <BreakpointsContext.Provider value={contextProps}>
      {children}
    </BreakpointsContext.Provider>
  );
}

ReactBreakpoints.propTypes = {
  breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
  breakpointUnit: PropTypes.oneOf(['px', 'em']),
  guessedBreakpoint: PropTypes.number,
  defaultBreakpoint: PropTypes.number,
  debounceResize: PropTypes.bool,
  debounceDelay: PropTypes.number,
};
