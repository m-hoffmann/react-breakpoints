import React from 'react';
import { withBreakpoints } from 'react-hook-breakpoints';

import { DisplayBreakpoint } from './DisplayBreakpoint';

const WithHOC = ({ breakpoints, currentBreakpoint }) => {
  return (
    <div>
      <h3>With withBreakpoints HOC</h3>
      <DisplayBreakpoint
        breakpoints={breakpoints}
        currentBreakpoint={currentBreakpoint}
      />
    </div>
  );
};

export default withBreakpoints(WithHOC);
