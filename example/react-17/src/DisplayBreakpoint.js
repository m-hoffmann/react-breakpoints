import React from 'react';

const DummyComponent = ({ name, style }) => <div style={style}>{name}</div>;

export function DisplayBreakpoint({ breakpoints, currentBreakpoint }) {
  return (
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
  );
}

export default DisplayBreakpoint;
