import { ReactNode, useMemo } from 'react';
import { objectOf, oneOf, number, bool } from 'prop-types';

import { validateBreakpoints } from './helpers/validateBreakpoints';
import { BreakpointsContext } from './BreakpointsContext';
import { useDetectWindowSize } from './useDetectWindowSize';
import { useDetectCurrentBreakpoint } from './useDetectCurrentBreakpoint';

import {
  BreakpointKey,
  Breakpoints,
  BreakpointsProps,
  BreakpointUnit,
} from './breakpoints';

/**
 * Props for WindowSizeBreakpoints
 */
export interface WindowSizeBreakpointsProps<
  K extends BreakpointKey = BreakpointKey,
> {
  /**
   * Your breakpoints object.
   */
  breakpoints: Breakpoints<K>;

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
 * Provides the breakpoints for consumer components
 * using [window.innerWidth](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
 *
 * Uses the events
 * - [resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event)
 * - [orientationchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event)
 */
export function WindowSizeBreakpoints<K extends BreakpointKey = BreakpointKey>(
  props: WindowSizeBreakpointsProps<K>,
) {
  validateBreakpoints(props.breakpoints);

  const {
    children,
    breakpoints,
    breakpointUnit = 'px',
    debounceResize = false,
    debounceDelay = 50,
    guessedBreakpoint = 0,
    defaultBreakpoint = 0,
  } = props;

  // get the screen size in px
  const screenSize = useDetectWindowSize({ debounceResize, debounceDelay });

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
    };
  }, [breakpoints, currentBreakpoint]);

  return (
    <BreakpointsContext.Provider value={contextProps}>
      {children}
    </BreakpointsContext.Provider>
  );
}

WindowSizeBreakpoints.propTypes = {
  breakpoints: objectOf(number).isRequired,
  breakpointUnit: oneOf(['px', 'em']),
  guessedBreakpoint: number,
  defaultBreakpoint: number,
  debounceResize: bool,
  debounceDelay: number,
};
