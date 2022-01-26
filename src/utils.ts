export function stripUnit(value: string | number): number {
  const unitlessValue = parseFloat((value as unknown) as string);
  if (isNaN(unitlessValue)) {
    return value as number; // FIXME: broken logic
  }
  return unitlessValue;
}

export function em(pxValue: number): string | number {
  const unitlessValue = stripUnit(pxValue);
  return `${unitlessValue / 16}em`;
}
