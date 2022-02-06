/**
 * Identifier for the breakpoint
 * @example "mobile" "desktop" "sm" "md" "lg"
 */
export type BreakpointKey = string;

/**
 * Supported units for sizes
 */
export type BreakpointUnit = 'px' | 'em';

/**
 * Record with your breakpoint definition
 * @example { mobile: 320, tablet: 768, desktop: 1200 }
 * @example { sm: 320, md: 768, lg: 1200 }
 */
export type BreakpointMap<B extends BreakpointKey = BreakpointKey> = Record<
  B,
  number
>;

/**
 * Record with your breakpoint definition
 * @example { sm: "(max-width: 320px)", md: "(min-width: 320px) and (max-width: 768px)", lg: "(min-width: 1200px)" }
 * @example { single: "all" }
 * @private for internal use
 */
export type BreakpointQueries<B extends BreakpointKey = BreakpointKey> = Record<
  B,
  string
>;

/**
 * Props passed by context to Consumers
 */
export interface BreakpointsProps<K extends BreakpointKey = BreakpointKey> {
  /**
   * The current breakpoints
   */
  breakpoints: Record<K, number>;
  /**
   * Current detected breakpoint
   */
  currentBreakpoint: K;
}

/**
 * Breakpoint as object
 * @example { name: "lg", width: 1200  }
 * @private for internal use
 */
export type BreakpointSize<K extends BreakpointKey = BreakpointKey> = {
  name: K;
  width: number;
};

/**
 * Breakpoint as object
 * @example { name: "desktop", width: 1200, query: "(min-width: 1200px)" }
 * @private for internal use
 */
export type BreakpointQuery<K extends BreakpointKey = BreakpointKey> = {
  /**
   * Name
   * @example "desktop"
   */
  name: K;
  /**
   * Width
   * @example 1920
   */
  width: number;
  /**
   * Media query
   * @example "(min-width: 1920px)"
   */
  query: string;
};

/**
 * Detected window size
 * @private for internal use
 * @example { width: 1920, height: 1080 }
 */
export interface WindowSize {
  width: number;
  height: number;
}
