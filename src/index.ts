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

// Provider: window.matchMedia
export type { MatchMediaBreakpointsProps as MatchMediaBreakpointsProps } from './MatchMediaBreakpoints';
export { MatchMediaBreakpoints } from './MatchMediaBreakpoints';

// Provider: window.innerWidth
export type { ReactBreakpointsProps } from './ReactBreakpoints';
import { ReactBreakpoints } from './ReactBreakpoints';
export default ReactBreakpoints;

// standalone

export { MatchMediaQuery } from './MatchMediaQuery';
export type { MatchMediaQueryProps } from './MatchMediaQuery';
