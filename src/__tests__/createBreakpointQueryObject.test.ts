import { createBreakpointQueryObject } from '../helpers/createBreakpointQueryObject';

describe('createBreakpointQueryObject', () => {
  it('creates the correct query for sm, md, lg', () => {
    const breakpoints = { sm: 10, md: 20, lg: 30 };
    const media = {
      sm: '(max-width: 20px)',
      md: '(min-width: 20px) and (max-width: 30px)',
      lg: '(min-width: 30px)',
    };

    expect(createBreakpointQueryObject(breakpoints, 'px')).toMatchObject(media);
  });

  it('handles edge case single breakpoint', () => {
    expect(createBreakpointQueryObject({ single: 1234 }, 'px')).toMatchObject({
      single: 'all',
    });
  });
});
