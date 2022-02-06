/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { WindowSizeBreakpoints, useBreakpoints } from 'react-hook-breakpoints';

describe('ReactBreakpoints on the server', function () {
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
        <WindowSizeBreakpoints
          breakpoints={null as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();
    expect(() =>
      renderToStaticMarkup(
        <WindowSizeBreakpoints
          breakpoints={123 as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();

    expect(() =>
      renderToStaticMarkup(
        <WindowSizeBreakpoints
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
        <WindowSizeBreakpoints
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
        <WindowSizeBreakpoints
          breakpoints={breakpoints}
          guessedBreakpoint={1900}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('desktop');
  });

  it('works without window and uses guessedBreakpoint tablet', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <WindowSizeBreakpoints
          breakpoints={breakpoints}
          guessedBreakpoint={800}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('tablet');
  });

  it('works without window and uses guessedBreakpoint mobile', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <WindowSizeBreakpoints
          breakpoints={breakpoints}
          guessedBreakpoint={600}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('mobile');
  });

  it('Renders breakpoints', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <WindowSizeBreakpoints
          breakpoints={breakpoints}
          guessedBreakpoint={600}
          children={<Breakpoints />}
        />,
      ),
    ).toBe(
      '{&quot;mobile&quot;:320,&quot;tablet&quot;:768,&quot;desktop&quot;:1200}',
    );
  });
});
