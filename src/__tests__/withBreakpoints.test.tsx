/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render } from '@testing-library/react';

import { withBreakpoints } from '../withBreakpoints';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps } from '../breakpoints';

describe('withBreakpoints', () => {
  type Breakpoints = 'sm' | 'md' | 'lg';

  const breakpointsProps: BreakpointsProps<Breakpoints> = {
    breakpoints: { sm: 1, md: 2, lg: 3 },
    currentBreakpoint: 'md',
    screenWidth: 1234,
  };

  const propsMock = jest.fn();

  beforeEach(() => {
    propsMock.mockClear();
    propsMock.mockImplementation((props: BreakpointsProps) => {
      return props;
    });
  });

  function WrappedComponent(
    props: BreakpointsProps<Breakpoints> & {
      s?: string;
      b?: boolean;
      n?: number;
    },
  ): JSX.Element {
    propsMock(props);
    return <div data-test-id="wrapped-component-body" />;
  }

  function WrappedComponentXYZ(): JSX.Element {
    return <div />;
  }

  WrappedComponentXYZ.displayName = 'XYZ';

  WrappedComponent.hello = 'world';
  WrappedComponent.foo = 42;

  const WithBreakPoints = withBreakpoints(WrappedComponent);
  const WithBreakPointsXYZ = withBreakpoints(WrappedComponentXYZ);

  it('renders the wrapped component', function () {
    const result = render(<WithBreakPoints />);

    expect(
      result.findByTestId('wrapped-component-body'),
    ).resolves.toBeDefined();
  });

  it('preserves the static properties of the wrapped component', () => {
    expect((WithBreakPoints as any).hello === WrappedComponent.hello);
    expect(((WithBreakPoints as any).foo = WrappedComponent.foo));
  });

  it('sets the displayName of the wrapped component', () => {
    expect(WithBreakPoints.displayName).toBe(
      'withBreakpoints(WrappedComponent)',
    );

    expect(WithBreakPointsXYZ.displayName).toBe('withBreakpoints(XYZ)');
  });

  it('passes the context props to the wrapped component', () => {
    render(
      <BreakpointsContext.Provider value={breakpointsProps}>
        <WithBreakPoints />
      </BreakpointsContext.Provider>,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: breakpointsProps,
      },
    ]);
  });

  it('passes the own props to the wrapped component', () => {
    render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <BreakpointsContext.Provider value={{} as any}>
        <WithBreakPoints s="s" n={1} b={false} />
      </BreakpointsContext.Provider>,
    );

    expect(propsMock.mock.results).toMatchObject([
      { type: 'return', value: { s: 's', n: 1, b: false } },
    ]);
  });
});
