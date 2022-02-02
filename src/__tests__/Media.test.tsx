import React from 'react';
import { render } from '@testing-library/react';

import { Media } from '../Media';
import { BreakpointsContext } from '../BreakpointsContext';
import { BreakpointsProps } from '../breakpoints';

describe('Media', () => {
  const propsMock = jest.fn();

  beforeEach(() => {
    propsMock.mockClear();
    propsMock.mockImplementation((props: BreakpointsProps) => {
      return props;
    });
  });

  type Breakpoints = 'sm' | 'md' | 'lg';

  const breakpointsProps: BreakpointsProps<Breakpoints> = {
    breakpoints: { sm: 1, md: 2, lg: 3 },
    currentBreakpoint: 'md',
    screenWidth: 1234,
  };

  function TestComponent() {
    return (
      <Media>
        {props => {
          propsMock(props);
          return <div data-test-id="some-component" />;
        }}
      </Media>
    );
  }

  it('passed the context props its child render function as arguments', () => {
    render(
      <BreakpointsContext.Provider value={breakpointsProps}>
        <TestComponent />
      </BreakpointsContext.Provider>,
    );

    expect(propsMock.mock.results).toMatchObject([
      {
        type: 'return',
        value: breakpointsProps,
      },
    ]);
  });
});
