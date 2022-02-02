/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import MatchMediaMock from 'jest-matchmedia-mock';

import { MediaMatchBreakpointsProvider as ReactBreakpoints } from '../MediaMatchBreakpointsProvider';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps } from '../breakpoints';
import { MatchBreakpoint } from '../MatchBreakpoint';

import { minWidth, maxWidth, minMaxWidth } from '../media-utils';

describe('MediaMatchBreakpointsProvider', function () {
  const breakpointUnit = 'px';
  const breakpoints = { sm: 10, md: 20, lg: 30 };
  const media = {
    sm: maxWidth(breakpoints.md, breakpointUnit),
    md: minMaxWidth(breakpoints.md, breakpoints.lg, breakpointUnit),
    lg: minWidth(breakpoints.lg, breakpointUnit),
  };

  const propsMock = jest.fn();

  function propsMockResult() {
    return propsMock.mock.results.map(v => v.value);
  }

  function Children({ text = '' }: { text?: string }) {
    const props = useContext(BreakpointsContext);
    propsMock(props);
    return <div data-test-id="children">{text}</div>;
  }

  /**
   * jsdom does not support this event
   */
  let matchMediaMock: MatchMediaMock;

  beforeAll(() => {
    matchMediaMock = new MatchMediaMock();
  });

  beforeEach(() => {
    propsMock.mockClear();
    propsMock.mockImplementation((props: BreakpointsProps) => {
      return props;
    });
    jest.spyOn(console, 'error').mockImplementation(() => {
      /* linter */
    });
  });

  afterEach(() => {
    matchMediaMock.clear();
  });

  afterAll(() => {
    matchMediaMock.destroy();
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

  it('passed breakpoints through context', function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    render(
      <ReactBreakpoints breakpoints={breakpoints} children={<Children />} />,
    );

    expect(propsMockResult()).toMatchObject([{ breakpoints }]);
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

  it('works with unit em', function () {
    const result = render(
      <ReactBreakpoints
        breakpoints={{ xs: 1 }}
        breakpointUnit="em"
        children={<div data-test-id="children" />}
      />,
    );

    expect(result.findByTestId('children')).resolves.toBeDefined();
  });

  it('renders sm', function () {
    matchMediaMock.useMediaQuery(media.sm);

    const result = render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<MatchBreakpoint is="sm" children={<Children />} />}
      />,
    );

    expect(result.findByTestId('children')).resolves.toBeDefined();
  });

  it('renders md', function () {
    matchMediaMock.useMediaQuery(media.md);

    const result = render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<MatchBreakpoint is="md" children={<Children />} />}
      />,
    );

    expect(result.findByTestId('children')).resolves.toBeDefined();
  });

  it('renders lg', function () {
    matchMediaMock.useMediaQuery(media.lg);

    const result = render(
      <ReactBreakpoints
        breakpoints={breakpoints}
        children={<MatchBreakpoint is="lg" children={<Children />} />}
      />,
    );

    expect(result.findByTestId('children')).resolves.toBeDefined();
  });
});