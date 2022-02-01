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

export type { MediaMatchBreakpointsProviderProps } from './MediaMatchBreakpointsProvider';
export { MediaMatchBreakpointsProvider } from './MediaMatchBreakpointsProvider';

export type { ReactBreakpointsProps } from './ReactBreakpoints';
import { ReactBreakpoints } from './ReactBreakpoints';
export default ReactBreakpoints;
