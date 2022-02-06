import type { BreakpointUnit } from '../breakpoints';

export function convertScreenWidth(
  screenWidth: number,
  breakpointUnit: BreakpointUnit,
): number {
  return breakpointUnit === 'em' ? screenWidth / 16 : screenWidth;
}
