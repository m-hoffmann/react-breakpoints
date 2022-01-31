/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ReactBreakpoints } from '../ReactBreakpoints';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps } from '../breakpoints';

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

describe('ReactBreakpoints', function () {
  const propsMock = jest.fn();

  function Children() {
    const props = useContext(BreakpointsContext);
    propsMock(props);
    return <div data-test-id="children" />;
  }

  beforeEach(() => {
    propsMock.mockReset();
    propsMock.mockImplementation((props: BreakpointsProps) => {
      return props;
    });
    jest.spyOn(console, 'error').mockImplementation(() => {
      /* linter */
    });
  });

  it('explodes if there are no breakpoints', function () {
    expect(() =>
      render(
        <ReactBreakpoints breakpoints={null as any} children={<Children />} />,
      ),
    ).toThrow();
    expect(() =>
      render(
        <ReactBreakpoints breakpoints={123 as any} children={<Children />} />,
      ),
    ).toThrow();

    expect(() =>
      render(<ReactBreakpoints breakpoints={{}} children={<Children />} />),
    ).toThrow();
  });

  it('renders its children', function () {
    const result = render(
      <ReactBreakpoints
        breakpoints={{ xs: 1 }}
        children={<div data-test-id="children" />}
      />,
    );

    expect(result.findByTestId('children')).resolves.toBeDefined();
  });

  it('passed breakpoints through context', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      { type: 'return', value: { breakpoints } },
    ]);
  });

  it('detects currentBreakpoint "desktop" for innerWidth = 1920', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const screenWidth = 1920;
    global.innerWidth = 1920;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'desktop', screenWidth },
      },
    ]);
  });

  it('detects currentBreakpoint "tablet" for innerWidth = 800', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    global.innerWidth = 800;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet', screenWidth: 800 },
      },
    ]);
  });

  it('detects currentBreakpoint "mobile" for innerWidth = 240', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    global.innerWidth = 240;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile', screenWidth: 240 },
      },
    ]);
  });

  it('detects currentBreakpoint "mobile" for innerWidth = 100', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    global.innerWidth = 100;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile', screenWidth: 100 },
      },
    ]);
  });

  it('detects screenWidth = 1234', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const screenWidth = 1234;
    global.innerWidth = screenWidth;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      { type: 'return', value: { breakpoints, screenWidth } },
    ]);
  });

  it('detects currentBreakpoint "desktop" for innerWidth = 1920 with breakpointUnit = "em"', function () {
    const breakpoints = {
      mobile: 20, // 20em = 320px
      tablet: 48, // 48em = 768px
      desktop: 75, //  75em = 1200px
    };

    const screenWidth = 1920; // = 120em
    global.innerWidth = screenWidth;

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        breakpointUnit="em"
        children={<Children />}
      />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'desktop', screenWidth: 120 },
      },
    ]);
  });

  it('detects currentBreakpoint "tablet" for innerWidth = 800 with breakpointUnit = "em"', function () {
    const breakpoints = {
      mobile: 20, // 20em = 320px
      tablet: 48, // 48em = 768px
      desktop: 75, //  75em = 1200px
    };

    const screenWidth = 800; // = 50em
    global.innerWidth = screenWidth;

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        breakpointUnit="em"
        children={<Children />}
      />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet', screenWidth: 50 },
      },
    ]);
  });

  it('detects changes in breakpoints', async function () {
    const initialBreakPoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const nextBreakpoints = {
      sm: 320,
      md: 768,
      lg: 1200,
    };

    const moreBreakpoints = {
      sm: 320,
      md: 768,
      lg: 1200,
      xl: 1920,
    };

    const screenWidth = 800; // = 50em
    global.innerWidth = screenWidth;

    const result = render(
      <ReactBreakpoints
        breakpoints={initialBreakPoints}
        children={<Children />}
      />,
    );

    result.rerender(
      <ReactBreakpoints
        breakpoints={nextBreakpoints}
        children={<Children />}
      />,
    );

    result.rerender(
      <ReactBreakpoints
        breakpoints={moreBreakpoints}
        children={<Children />}
      />,
    );

    await delay(0); // useEffect

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: {
          breakpoints: initialBreakPoints,
          currentBreakpoint: 'tablet',
          screenWidth,
        },
      },
      {
        type: 'return',
        value: {
          breakpoints: nextBreakpoints,
          currentBreakpoint: 'md',
          screenWidth,
        },
      },
      {
        type: 'return',
        value: {
          breakpoints: moreBreakpoints,
          currentBreakpoint: 'md',
          screenWidth,
        },
      },
    ]);
  });

  it('detects changes in window size', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    global.innerWidth = 1920;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    global.innerWidth = 800;

    fireEvent.resize(global.window);

    global.innerWidth = 600;

    fireEvent.resize(global.window);

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'desktop', screenWidth: 1920 },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet', screenWidth: 800 },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile', screenWidth: 600 },
      },
    ]);
  });

  it('detects changes in window size when using debounceResize', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    global.innerWidth = 1920;

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<Children />}
        debounceResize
        debounceDelay={25}
      />,
    );

    global.innerWidth = 800;

    fireEvent.resize(global.window);

    global.innerWidth = 600;

    fireEvent.resize(global.window);

    await delay(30);

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'desktop', screenWidth: 1920 },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile', screenWidth: 600 },
      },
    ]);
  });

  it('works without detected window but with guessedBreakpoint', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<Children />}
        guessedBreakpoint={breakpoints.tablet}
        ignoreScreenSize
      />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet', screenWidth: 0 },
      },
    ]);
  });

  it('works without detected window and defaultBreakpoint', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<Children />}
        defaultBreakpoint={breakpoints.tablet}
        ignoreScreenSize
      />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet', screenWidth: 0 },
      },
    ]);
  });

  it('without detected window and no other hints it uses the smallest breakpoint', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<Children />}
        ignoreScreenSize
      />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile', screenWidth: 0 },
      },
    ]);
  });
});
