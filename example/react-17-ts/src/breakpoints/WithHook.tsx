import { useBreakpoints } from 'react-hook-breakpoints';

import { DisplayBreakpoint } from './DisplayBreakpoint';

function WithHook() {
  const { breakpoints, currentBreakpoint } = useBreakpoints();
  return (
    <div>
      <h3>
        <code>useBreakpoints</code>
        <br />
        <small>hook</small>
      </h3>
      <DisplayBreakpoint
        breakpoints={breakpoints}
        currentBreakpoint={currentBreakpoint}
      />
    </div>
  );
}

export default WithHook;
