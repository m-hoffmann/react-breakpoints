import React, { useContext } from 'react';
import { render, fireEvent } from '@testing-library/react';

import ReactBreakpoints from '../ReactBreakpoints';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps } from '../breakpoints';

describe('<ReactBreakpoints />', function () {
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

    global.innerWidth = 1920;

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      { type: 'return', value: { breakpoints, currentBreakpoint: 'desktop' } },
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
      { type: 'return', value: { breakpoints, currentBreakpoint: 'tablet' } },
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
      { type: 'return', value: { breakpoints, currentBreakpoint: 'mobile' } },
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
      { type: 'return', value: { breakpoints, currentBreakpoint: 'mobile' } },
    ]);
  });

  it('detects screenWidth = 1234 if snapMode = false', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const screenWidth = 1234;
    global.innerWidth = screenWidth;

    render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<Children />}
        snapMode={false}
      />,
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
      { type: 'return', value: { breakpoints, currentBreakpoint: 'desktop' } },
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
      { type: 'return', value: { breakpoints, currentBreakpoint: 'tablet' } },
    ]);
  });

  it('detects changes in breakpoints', function () {
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

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints: initialBreakPoints, currentBreakpoint: 'tablet' },
      },
      {
        type: 'return',
        value: { breakpoints: nextBreakpoints, currentBreakpoint: 'md' },
      },
    ]);
  });

  it('re-renders if the same object reference is passed again for breakpoints', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const screenWidth = 800; // = 50em
    global.innerWidth = screenWidth;

    const result = render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    result.rerender(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet' },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet' },
      },
    ]);
  });

  it('re-renders when breakpoints is a new object reference, unfortunately', function () {
    const initialBreakPoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const nextBreakpoints = {
      ...initialBreakPoints,
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

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: { breakpoints: initialBreakPoints, currentBreakpoint: 'tablet' },
      },
      {
        type: 'return',
        value: { breakpoints: nextBreakpoints, currentBreakpoint: 'tablet' },
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
        value: { breakpoints, currentBreakpoint: 'desktop' },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'tablet' },
      },
      {
        type: 'return',
        value: { breakpoints, currentBreakpoint: 'mobile' },
      },
    ]);
  });
});
