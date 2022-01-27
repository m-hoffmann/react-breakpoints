import {
  BreakpointMap,
  BreakpointUnit,
  SortedBreakpoints,
} from './breakpoints';

function stripUnit(value: string | number): number {
  const unitlessValue = parseFloat(value as unknown as string);
  if (isNaN(unitlessValue)) {
    return value as number; // FIXME: broken logic
  }
  return unitlessValue;
}

function em(pxValue: number): string | number {
  const unitlessValue = stripUnit(pxValue);
  return `${unitlessValue / 16}em`;
}

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
  return breakpointUnit === 'em' ? stripUnit(em(screenWidth)) : screenWidth;
}
