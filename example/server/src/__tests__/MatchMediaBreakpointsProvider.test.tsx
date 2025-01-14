/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MatchMediaBreakpoints, useBreakpoints } from 'react-hook-breakpoints';

describe('MatchMediaBreakpoints on the server', function () {
  type Breakpoint = 'desktop' | 'tablet' | 'mobile';

  function CurrentBreakpoint() {
    const props = useBreakpoints<Breakpoint>();

    return <>{props.currentBreakpoint}</>;
  }

  function Breakpoints() {
    const props = useBreakpoints<Breakpoint>();
    return <>{JSON.stringify(props.breakpoints)}</>;
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      /* linter */
    });
  });

  it('explodes if there are no breakpoints', function () {
    expect(() =>
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={null as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();
    expect(() =>
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={123 as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();

    expect(() =>
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={{}}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();
  });

  it('works without window and just the breakpoints, detects mobile', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={breakpoints}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('mobile');
  });

  it('works without window and uses guessedBreakpoint desktop', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={breakpoints}
          defaultBreakpoint="desktop"
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('desktop');
  });

  it('works without window and uses defaultBreakpoint tablet', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={breakpoints}
          defaultBreakpoint="tablet"
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('tablet');
  });

  it('works without window and uses guessedBreakpoint mobile', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={breakpoints}
          defaultBreakpoint="mobile"
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('mobile');
  });

  it('Renders breakpoints', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MatchMediaBreakpoints
          breakpoints={breakpoints}
          children={<Breakpoints />}
        />,
      ),
    ).toBe(
      '{&quot;mobile&quot;:320,&quot;tablet&quot;:768,&quot;desktop&quot;:1200}',
    );
  });
});
