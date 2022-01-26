import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';

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
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
});
