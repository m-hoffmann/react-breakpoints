import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { em, stripUnit } from './utils';

import { BreakpointsContext } from './BreakpointsContext';

import { ERRORS } from './messages';

import {
  BreakpointKey,
  BreakpointMap,
  BreakpointsProps,
  BreakpointUnit,
} from './breakpoints';

const globalWindow: Window | null =
  typeof window !== 'undefined' ? window : null;

export interface ReactBreakpointsProps {
  /**
   * Your breakpoints object.
   */
  breakpoints: BreakpointMap;
  /**
   * The type of unit that your breakpoints should use - px or em.
   * @default "px"
   */
  breakpointUnit?: BreakpointUnit;
  /**
   * When rendering on the server, you can do your own magic with for example UA
   * to guess which viewport width a user probably has.
   */
  guessedBreakpoint?: number; // from server
  /**
   * In case you don't want to default to mobile on SSR and no guessedBreakpoint
   * is passed, use defaultBreakpoint to set your own value.
   */
  defaultBreakpoint?: number;
  /**
   * If you don't want the resize listener to be debounced, set to false. Defaults to false
   * when snapMode is true.
   * @default false
   */
  debounceResize?: boolean;
  /**
   * Set a custom delay for how long the debounce timeout should be.
   * @default 50
   */
  debounceDelay?: number;
  /**
   * Replaces breakpoints.current with screenWidth, disabling re-render only
   * when breakpoint changes, instead potentially re-rendering when
   * calculateCurrentBreakpoint returns a new value.
   * @default true
   */
  snapMode?: boolean;
}

/**
 * Array with breakpoints
 * @example,  [["xs", 320], [md: 640]]
 */
type SortedBreakpoints = [string, number][];

interface ReactBreakpointsState {
  /**
   * Copy of breakpoints
   */
  breakpoints: BreakpointMap;
  /**
   * Sorted breakpoints
   */
  sortedBreakpoints: SortedBreakpoints;

  /**
   * Name of current breakpoint
   * undefined if `snapMode=true`
   */
  currentBreakpoint?: BreakpointKey;

  /**
   * Current screen width
   * undefined if `snapMode=false`
   */
  screenWidth?: number;
}

/**
 * Provides the breakpoints for
 * - `Media` Component
 * - `withBreakpoints`
 * - `useBreakpoints`
 */
class ReactBreakpoints extends React.Component<
  ReactBreakpointsProps,
  ReactBreakpointsState
> {
  static defaultProps = {
    breakpointUnit: 'px',
    debounceResize: false,
    debounceDelay: 50,
    snapMode: true,
  };

  static propTypes = {
    breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
    breakpointUnit: PropTypes.oneOf(['px', 'em']),
    guessedBreakpoint: PropTypes.number,
    defaultBreakpoint: PropTypes.number,
    debounceResize: PropTypes.bool,
    debounceDelay: PropTypes.number,
    snapMode: PropTypes.bool,
  };

  constructor(props: ReactBreakpointsProps) {
    super(props);
    const { breakpoints, defaultBreakpoint, guessedBreakpoint } = this.props;

    // throw Error if no breakpoints were passed
    if (!breakpoints) throw new Error(ERRORS.NO_BREAKPOINTS);
    // throw Error if breakpoints is not an object
    if (typeof breakpoints !== 'object') throw new Error(ERRORS.NOT_OBJECT);

    let currentBreakpoint = '';

    const sortedBreakpoints = ReactBreakpoints.sortBreakpoints(breakpoints);

    // if we are on the client, we directly compote the breakpoint using window width
    if (globalWindow) {
      currentBreakpoint = ReactBreakpoints.calculateBreakpoint(
        this.convertScreenWidth(globalWindow.innerWidth),
        sortedBreakpoints,
      );
    } else if (guessedBreakpoint) {
      currentBreakpoint = ReactBreakpoints.calculateBreakpoint(
        guessedBreakpoint,
        sortedBreakpoints,
      );
    } else if (defaultBreakpoint) {
      currentBreakpoint = ReactBreakpoints.calculateBreakpoint(
        defaultBreakpoint,
        sortedBreakpoints,
      );
    }

    const screenWidth = globalWindow
      ? this.convertScreenWidth(globalWindow.innerWidth)
      : defaultBreakpoint;
    this.state = {
      breakpoints: breakpoints ?? {},
      // if we are on the client, we set the screen width to the window width,
      // otherwise, we use the default breakpoint
      screenWidth: screenWidth,
      currentBreakpoint: currentBreakpoint,
      sortedBreakpoints,
    };
  }

  componentWillReceiveProps(nextProps: ReactBreakpointsProps) {
    const { breakpoints: newBreakpoint } = nextProps;
    const { breakpoints } = this.props;
    if (newBreakpoint != breakpoints) {
      this.updateBreakpoints(newBreakpoint);
    }
  }

  convertScreenWidth(screenWidth: number): number {
    const { breakpointUnit } = this.props;
    return breakpointUnit === 'em' ? stripUnit(em(screenWidth)) : screenWidth;
  }

  componentDidMount() {
    if (globalWindow) {
      this.readWidth(); // initial width calculation

      if (this.props.debounceResize) {
        globalWindow.addEventListener(
          'resize',
          debounce(this.readWidth, this.props.debounceDelay),
        );
      } else {
        globalWindow.addEventListener('resize', this.readWidth);
      }
      globalWindow.addEventListener('orientationchange', this.readWidth);
    }
  }
  componentWillUnmount() {
    if (globalWindow) {
      if (this.props.debounceResize) {
        globalWindow.addEventListener(
          'resize',
          debounce(this.readWidth, this.props.debounceDelay),
        );
      } else {
        globalWindow.addEventListener('resize', this.readWidth);
      }
      globalWindow.removeEventListener('orientationchange', this.readWidth);
    }
  }

  static sortBreakpoints(breakpoints: BreakpointMap): SortedBreakpoints {
    return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
  }

  // breakpoints should be sorted
  static calculateBreakpoint(
    screenWidth: number,
    breakpoints: [string, number][],
  ): string {
    for (let b of breakpoints) {
      if (screenWidth >= b[1]) {
        return b[0];
      }
    }
    // screenWidth is below lowest breakpoint,
    // so it will still be set to equal lowest breakpoint instead of null
    return breakpoints[breakpoints.length - 1][0];
  }

  private updateBreakpoints(breakpoints: BreakpointMap): void {
    this.setState({
      sortedBreakpoints: ReactBreakpoints.sortBreakpoints(breakpoints),
    });
  }

  private calculateCurrentBreakpoint(screenWidth: number) {
    return ReactBreakpoints.calculateBreakpoint(
      screenWidth,
      this.state.sortedBreakpoints,
    );
  }

  private readWidth = (event?: UIEvent | Event) => {
    const { snapMode } = this.props;

    // TODO: find out why if there are any additional elemens with innerWidth
    type ElementWithInnerWidth = Window;
    const element: ElementWithInnerWidth | undefined =
      event?.target as ElementWithInnerWidth;

    // read width from event or window
    const width = element?.innerWidth
      ? element.innerWidth
      : globalWindow?.innerWidth ?? 0;

    let screenWidth = this.convertScreenWidth(width);

    const current = this.calculateCurrentBreakpoint(screenWidth);

    this.setState(state => {
      if (state.currentBreakpoint === current) {
        return null; // no patch
      }
      if (snapMode) {
        return {
          currentBreakpoint: current,
        };
      } else {
        return {
          screenWidth,
        };
      }
    });
  };

  private getSnapModeProps = (): Pick<
    BreakpointsProps,
    'currentBreakpoint' | 'screenWidth'
  > =>
    this.props.snapMode
      ? { currentBreakpoint: this.state.currentBreakpoint }
      : { screenWidth: this.state.screenWidth };

  private getContextValues = (): BreakpointsProps => ({
    breakpoints: this.props.breakpoints,
    ...this.getSnapModeProps(),
  });

  render() {
    const { children } = this.props;
    return (
      <BreakpointsContext.Provider value={this.getContextValues()}>
        {children && children}
      </BreakpointsContext.Provider>
    );
  }
}

export default ReactBreakpoints;
