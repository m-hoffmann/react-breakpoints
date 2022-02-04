import React from 'react';
import { Media } from 'react-hook-breakpoints';

import { DisplayBreakpoint } from './DisplayBreakpoint';

function WithRenderProps() {
  return (
    <div>
      <h3>With Render Props Media Component</h3>
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
