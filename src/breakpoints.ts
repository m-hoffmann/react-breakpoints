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
  /**
   * The current screen width in `BreakpointUnit`
   */
  screenWidth: number;
}

/**
 * Array with breakpoints
 * @example [ ["lg", 800], ["md", 640], ["xs", 320]]
 * @private for internal use
 */
export type SortedBreakpoints<K extends BreakpointKey = BreakpointKey> = [
  K,
  number,
][];

/**
 * Array with breakpoints queries
 * @example [["md", "min-width: 640px)"], ["xs", "(max-width: 640px)"]]
 * @example ["single", ""]
 * @private for internal use
 */
export type SortedBreakpointQueries<K extends BreakpointKey = BreakpointKey> = [
  K,
  string,
][];

/**
 * @private for internal use
 */
export interface ScreenSize {
  width: number;
  height: number;
}
