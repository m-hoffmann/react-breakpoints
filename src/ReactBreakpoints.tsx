import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import {
  sortBreakpoints,
  convertScreenWidth,
  calculateBreakpoint,
} from './utils';

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

interface ReactBreakpointsState {
  /**
   * Name of current breakpoint
   * undefined if `snapMode=true`
   */
  currentBreakpoint: BreakpointKey;

  /**
   * Current screen width
   * undefined if `snapMode=false`
   */
  screenWidth: number;
}

/**
 * Provides the breakpoints for
 * - `Media` Component
 * - `withBreakpoints`
 * - `useBreakpoints`
 */
class ReactBreakpoints extends React.PureComponent<
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

  static getDerivedStateFromProps(
    props: ReactBreakpointsProps,
    state: ReactBreakpointsState,
  ) {
    const nextState = ReactBreakpoints.calculateBreakpointState(props);

    // patch the state if something changes
    if (
      nextState.currentBreakpoint !== state.currentBreakpoint ||
      nextState.screenWidth !== state.screenWidth
    ) {
      return { ...state, ...ReactBreakpoints.calculateBreakpointState(props) };
    }

    // keep existing state
    return state;
  }

  constructor(props: ReactBreakpointsProps) {
    super(props);
    const { breakpoints } = this.props;

    // throw Error if no breakpoints were passed
    if (!breakpoints) {
      throw new Error(ERRORS.NO_BREAKPOINTS);
    }

    // throw Error if breakpoints is not an object
    if (typeof breakpoints !== 'object') {
      throw new Error(ERRORS.NOT_OBJECT);
    }

    this.state = ReactBreakpoints.calculateBreakpointState(props);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private readWidth = (event?: UIEvent | Event) => {
    this.setState(state => {
      const nextState = ReactBreakpoints.calculateBreakpointState(this.props);
      if (state.currentBreakpoint === nextState.currentBreakpoint) {
        return null; // no patch
      }

      return nextState;
    });
  };

  /**
   * Called when
   * - window size or changes
   * - window orientation changes
   * - new breakpoints passed
   * @param screenWidth
   */
  private static calculateBreakpointState(
    props: ReactBreakpointsProps,
  ): ReactBreakpointsState {
    const { breakpoints, defaultBreakpoint, guessedBreakpoint } = props;

    // with fallback from defaultProps
    const breakpointUnit = props.breakpointUnit as BreakpointUnit;

    let currentBreakpoint = '';

    const screenWidth = globalWindow
      ? convertScreenWidth(globalWindow.innerWidth, breakpointUnit)
      : 0;

    const sortedBreakpoints = sortBreakpoints(breakpoints);

    // if we are on the client, we directly compose the breakpoint using window width
    if (globalWindow) {
      currentBreakpoint = calculateBreakpoint(screenWidth, sortedBreakpoints);
    } else if (guessedBreakpoint) {
      currentBreakpoint = calculateBreakpoint(
        guessedBreakpoint,
        sortedBreakpoints,
      );
    } else if (defaultBreakpoint) {
      currentBreakpoint = calculateBreakpoint(
        defaultBreakpoint,
        sortedBreakpoints,
      );
    }

    return {
      screenWidth,
      currentBreakpoint,
    };
  }

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
        {children}
      </BreakpointsContext.Provider>
    );
  }
}

export default ReactBreakpoints;
