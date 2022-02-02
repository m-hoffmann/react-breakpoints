import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';

// documents dangers of react-testing library
describe('EventThing', () => {
  const addListener = jest.fn();
  const removeListener = jest.fn();

  beforeEach(() => {
    // required because of testing-library cleanup
    addListener.mockClear();
    removeListener.mockClear();
  });

  function EventThing(): JSX.Element {
    useEffect(() => {
      addListener();

      return () => {
        removeListener();
      };
    }, []);

    return <div>Hello World!</div>;
  }

  it('calls addListener once', () => {
    render(<EventThing />);
    expect(addListener).toHaveBeenCalledTimes(1);
  });

  it('does not call removeListener without unmounting', () => {
    render(<EventThing />);
    expect(removeListener).toHaveBeenCalledTimes(0);
  });

  it('calls removeListener once with unmounting', () => {
    const renderer = render(<EventThing />);
    act(() => renderer.unmount());
    expect(removeListener).toHaveBeenCalledTimes(1);
  });
});
