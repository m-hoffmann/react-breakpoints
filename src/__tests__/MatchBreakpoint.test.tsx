/* eslint-disable react/no-children-prop */
import React from 'react';
import { render } from '@testing-library/react';

import { MatchBreakpoint } from '../MatchBreakpoint';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps, BreakpointMap } from '../breakpoints';

describe('MatchBreakpoint', () => {
  type Breakpoints = 'sm' | 'md' | 'lg';

  const breakpoints: BreakpointMap<Breakpoints> = { sm: 100, md: 200, lg: 300 };

  const Sm = () => <div>sm</div>;
  const Md = () => <div>md</div>;
  const Lg = () => <div>lg</div>;

  describe('property "is"', () => {
    const breakpointsProps: BreakpointsProps<Breakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
      screenWidth: breakpoints.md,
    };

    it('renders [sm] for "sm"', () => {
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
  });

  describe('property "not"', () => {
    const breakpointsProps: BreakpointsProps<Breakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
      screenWidth: breakpoints.md,
    };

    it('renders [sm,lg] for "sm"', () => {
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
  });

  describe('property "min"', () => {
    const breakpointsProps: BreakpointsProps<Breakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
      screenWidth: breakpoints.md,
    };

    it('renders [md,lg] for "md"', () => {
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
    const breakpointsProps: BreakpointsProps<Breakpoints> = {
      breakpoints,
      currentBreakpoint: 'md',
      screenWidth: breakpoints.md,
    };

    it('renders [sm] for "md"', () => {
      const result = render(
        <BreakpointsContext.Provider value={breakpointsProps}>
          <MatchBreakpoint max="sm" children={<Sm />} />
          <MatchBreakpoint max="md" children={<Md />} />
          <MatchBreakpoint max="lg" children={<Lg />} />
        </BreakpointsContext.Provider>,
      );

      expect(result.queryByText('sm')).toBeFalsy();
      expect(result.queryByText('md')).toBeFalsy();
      expect(result.queryByText('lg')).toBeTruthy();
    });
  });
});