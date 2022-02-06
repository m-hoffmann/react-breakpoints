/* eslint-disable react/no-children-prop */
import { render } from '@testing-library/react';

import { MatchBreakpoint } from '../MatchBreakpoint';
import { BreakpointsContext } from '../BreakpointsContext';
import type { BreakpointsProps, Breakpoints } from '../breakpoints';

describe('MatchBreakpoint', () => {
  type MyBreakpoints = 'sm' | 'md' | 'lg';

  const breakpoints: Breakpoints<MyBreakpoints> = { sm: 100, md: 200, lg: 300 };

  const Sm = () => <div>sm</div>;
  const Md = () => <div>md</div>;
  const Lg = () => <div>lg</div>;

  describe('property "is"', () => {
    const breakpointsProps: BreakpointsProps<MyBreakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
    };

    it('renders [Md]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint is="sm" children={<Sm />} />
          <MatchBreakpoint is="md" children={<Md />} />
          <MatchBreakpoint is="lg" children={<Lg />} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('sm')).toBeFalsy();
      expect(result.queryByText('md')).toBeTruthy();
      expect(result.queryByText('lg')).toBeFalsy();
    });

    it('renders [1]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint is={['sm', 'md']} children={<>1</>} />
          <MatchBreakpoint is="lg" children={<>2</>} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('1')).toBeTruthy();
      expect(result.queryByText('2')).toBeFalsy();
    });
  });

  describe('property "not"', () => {
    const breakpointsProps: BreakpointsProps<MyBreakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
    };

    it('renders [Sm,Lg]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint not="sm" children={<Sm />} />
          <MatchBreakpoint not="md" children={<Md />} />
          <MatchBreakpoint not="lg" children={<Lg />} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('sm')).toBeTruthy();
      expect(result.queryByText('md')).toBeFalsy();
      expect(result.queryByText('lg')).toBeTruthy();
    });

    it('renders [1] for ["sm", "lg]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint not={['sm', 'lg']} children={<>1</>} />
          <MatchBreakpoint not={['md']} children={<>2</>} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('1')).toBeTruthy();
      expect(result.queryByText('2')).toBeFalsy();
    });
  });

  describe('property "min"', () => {
    const breakpointsProps: BreakpointsProps<MyBreakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
    };

    it('renders [Md,Lg]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint min="sm" children={<Sm />} />
          <MatchBreakpoint min="md" children={<Md />} />
          <MatchBreakpoint min="lg" children={<Lg />} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('sm')).toBeTruthy();
      expect(result.queryByText('md')).toBeTruthy();
      expect(result.queryByText('lg')).toBeFalsy();
    });
  });

  describe('property "max"', () => {
    const breakpointsProps: BreakpointsProps<MyBreakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
    };

    it('renders [Sm,Md]', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint max="sm" children={<Sm />} />
          <MatchBreakpoint max="md" children={<Md />} />
          <MatchBreakpoint max="lg" children={<Lg />} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('sm')).toBeFalsy();
      expect(result.queryByText('md')).toBeTruthy();
      expect(result.queryByText('lg')).toBeTruthy();
    });
  });
});
