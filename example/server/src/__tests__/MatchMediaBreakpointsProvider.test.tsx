/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  MediaMatchBreakpointsProvider,
  useBreakpoints,
} from 'react-hook-breakpoints';

describe('MediaMatchBreakpointsProvider on the server', function () {
  type Breakpoint = 'desktop' | 'tablet' | 'mobile';

  function CurrentBreakpoint() {
    const props = useBreakpoints<Breakpoint>();

    return <>{props.currentBreakpoint}</>;
  }

  function ScreenWidth() {
    const props = useBreakpoints<Breakpoint>();

    return <>{props.screenWidth}</>;
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
        <MediaMatchBreakpointsProvider
          breakpoints={null as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();
    expect(() =>
      renderToStaticMarkup(
        <MediaMatchBreakpointsProvider
          breakpoints={123 as any}
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toThrow();

    expect(() =>
      renderToStaticMarkup(
        <MediaMatchBreakpointsProvider
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
        <MediaMatchBreakpointsProvider
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
        <MediaMatchBreakpointsProvider
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
        <MediaMatchBreakpointsProvider
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
        <MediaMatchBreakpointsProvider
          breakpoints={breakpoints}
          defaultBreakpoint="mobile"
          children={<CurrentBreakpoint />}
        />,
      ),
    ).toBe('mobile');
  });

  it('Detects screenWidth 0', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MediaMatchBreakpointsProvider
          breakpoints={breakpoints}
          children={<ScreenWidth />}
        />,
      ),
    ).toBe('0');
  });

  it('Renders breakpoints', function () {
    const breakpoints = { mobile: 320, tablet: 768, desktop: 1200 };

    expect(
      renderToStaticMarkup(
        <MediaMatchBreakpointsProvider
          breakpoints={breakpoints}
          children={<Breakpoints />}
        />,
      ),
    ).toBe(
      '{&quot;mobile&quot;:320,&quot;tablet&quot;:768,&quot;desktop&quot;:1200}',
    );
  });
});
