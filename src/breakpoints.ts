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
   * Undefined if `snapMode={true}`
   */
  currentBreakpoint?: K;
  /**
   * Undefined if `snapMode={false}`
   */
  screenWidth?: number;
}
