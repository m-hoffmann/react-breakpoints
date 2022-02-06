import React from 'react';
import { Media } from 'react-hook-breakpoints';

import { DisplayBreakpoint } from './DisplayBreakpoint';

function WithRenderProps() {
  return (
    <div>
      <h3>
        <code>Media</code>
        <br />
        <small> component with function as children</small>
      </h3>
      <Media>
        {({ breakpoints, currentBreakpoint }) => (
          <DisplayBreakpoint
            breakpoints={breakpoints}
            currentBreakpoint={currentBreakpoint}
          />
        )}
      </Media>
    </div>
  );
}

export default WithRenderProps;
