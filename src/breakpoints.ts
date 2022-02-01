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
 * @example,  [["xs", 320], [md: 640]]
 */
export type SortedBreakpoints<K extends BreakpointKey = BreakpointKey> = [
  K,
  number,
][];

/**
 * @private for internal use
 */
export interface ScreenSize {
  width: number;
  height: number;
}
