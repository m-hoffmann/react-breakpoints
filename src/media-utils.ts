import { BreakpointUnit } from './breakpoints';

export function minWidth(value: number, unit: BreakpointUnit): string {
  return `(min-width: ${value}${unit})`;
}

export function maxWidth(value: number, unit: BreakpointUnit): string {
  return `(max-width: ${value}${unit})`;
}

export function minMaxWidth(
  min: number,
  max: number,
  unit: BreakpointUnit,
): string {
  return `${minWidth(min, unit)} and ${maxWidth(max, unit)}`;
}
