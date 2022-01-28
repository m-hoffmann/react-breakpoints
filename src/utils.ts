import {
  BreakpointMap,
  BreakpointUnit,
  SortedBreakpoints,
} from './breakpoints';

export function calculateBreakpoint(
  screenWidth: number,
  breakpoints: SortedBreakpoints,
): string {
  for (const b of breakpoints) {
    if (screenWidth >= b[1]) {
      return b[0];
    }
  }
  // screenWidth is below lowest breakpoint,
  // so it will still be set to equal lowest breakpoint instead of null
  return breakpoints[breakpoints.length - 1][0];
}

export function sortBreakpoints(breakpoints: BreakpointMap): SortedBreakpoints {
  return Object.entries(breakpoints).sort((a, b) => b[1] - a[1]);
}

export function convertScreenWidth(
  screenWidth: number,
  breakpointUnit: BreakpointUnit,
): number {
  return breakpointUnit === 'em' ? screenWidth / 16 : screenWidth;
}
