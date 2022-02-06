import { render } from '@testing-library/react';

import { useBreakpoints } from '../useBreakpoints';
import { BreakpointsContext } from '../BreakpointsContext';
import type { BreakpointsProps } from '../breakpoints';

describe('useBreakpoints', () => {
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
  };

  function SomeComponent(): JSX.Element {
    const props = useBreakpoints();
    propsMock(props);
    return <div data-test-id="some-component" />;
  }

  it('returns the context props', () => {
    render(
      <BreakpointsContext.Provider value={breakpointsProps}>
        <SomeComponent />
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
