import React from 'react';
import { useBreakpoints } from 'react-breakpoints-todo';

const DummyComponent = ({ name }) => <div>{name}</div>;

const WithHook = props => {
  const { breakpoints, currentBreakpoint } = useBreakpoints();
  return (
    <div>
      <h3>With hook useBreakpoints</h3>
      <React.Fragment>
        <h4>
          Your current breakpoint is{' '}
          <code>
            <pre>{currentBreakpoint}</pre>
          </code>
        </h4>
        {breakpoints[currentBreakpoint] > breakpoints.tablet ? (
          <div>Should only be seen on tablet and above :)</div>
        ) : (
          <div />
        )}
        <DummyComponent
          name={
            breakpoints[currentBreakpoint] < breakpoints.desktop
              ? 'Below desktop'
              : 'Above desktop'
          }
          style={{
            color: 'rebeccapurple',
            ...(breakpoints[currentBreakpoint] < breakpoints.desktop && {
              color: 'red',
            }),
          }}
        />
      </React.Fragment>
    </div>
  );
};

export default WithHook;
