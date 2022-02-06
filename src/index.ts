// shared type exports
export type {
  BreakpointKey,
  BreakpointUnit,
  BreakpointsProps,
} from './breakpoints';

// Consumer: HOC version
export type { WithBreakpointsProps } from './withBreakpoints';
export { withBreakpoints } from './withBreakpoints';

// Consumer: hook version
export { useBreakpoints } from './useBreakpoints';

// Consumer: render children props versions
export type { MediaProps } from './Media';
export { Media } from './Media';

// Consumer: MatchBreakpoint
export type { MatchBreakpointProps } from './MatchBreakpoint';
export { MatchBreakpoint } from './MatchBreakpoint';

// Provider: default provider export for compatibility
export type { ReactBreakpointsProps } from './MatchMediaBreakpoints';
export { default } from './MatchMediaBreakpoints';

// Provider: window.matchMedia
export type { MatchMediaBreakpointsProps } from './MatchMediaBreakpoints';
export { MatchMediaBreakpoints } from './MatchMediaBreakpoints';

// Provider: window.innerWidth
export type { WindowSizeBreakpointsProps } from './WindowSizeBreakpoints';
export { WindowSizeBreakpoints } from './WindowSizeBreakpoints';

// standalone

export { MatchMediaQuery } from './MatchMediaQuery';
export type { MatchMediaQueryProps } from './MatchMediaQuery';
