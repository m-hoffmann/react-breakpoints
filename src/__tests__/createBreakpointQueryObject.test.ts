import {
  minWidth,
  maxWidth,
  minMaxWidth,
  createBreakpointQueryObject,
} from '../media-utils';

describe('createBreakpointQueryObject', () => {
  it('creates the correct query for sm, md, lg', () => {
    const breakpointUnit = 'px';
    const breakpoints = { sm: 10, md: 20, lg: 30 };
    const media = {
      sm: maxWidth(breakpoints.md, breakpointUnit),
      md: minMaxWidth(breakpoints.md, breakpoints.lg, breakpointUnit),
      lg: minWidth(breakpoints.lg, breakpointUnit),
    };

    expect(createBreakpointQueryObject(breakpoints, 'px')).toMatchObject(media);
  });

  it('handles edge case single breakpoint', () => {
    expect(createBreakpointQueryObject({ single: 1234 }, 'px')).toMatchObject({
      single: 'all',
    });
  });
});
