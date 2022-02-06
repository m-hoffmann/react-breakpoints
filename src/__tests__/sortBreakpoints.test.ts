import { sortBreakpoints } from '../helpers/sortBreakpoints';

describe('sortBreakpoints', () => {
  const breakpoints = Object.freeze({ sm: 10, md: 20, lg: 30 });
  const ordered = Object.freeze([
    { name: 'lg', width: 30 },
    { name: 'md', width: 20 },
    { name: 'sm', width: 10 },
  ]);

  it('sorts in descending order by default', () => {
    expect(sortBreakpoints(breakpoints)).toMatchObject(ordered);
  });

  it('sorts in descending order  correctly', () => {
    expect(sortBreakpoints(breakpoints, 'desc')).toMatchObject(ordered);
  });

  it('sorts in descending order by default', () => {
    expect(sortBreakpoints(breakpoints, 'asc')).toMatchObject(
      [...ordered].reverse(),
    );
  });
});
