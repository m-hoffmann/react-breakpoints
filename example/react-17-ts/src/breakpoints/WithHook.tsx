import { useBreakpoints } from 'react-hook-breakpoints';

import { DisplayBreakpoint } from './DisplayBreakpoint';

function WithHook() {
  const { breakpoints, currentBreakpoint } = useBreakpoints();
  return (
    <div>
      <h3>With hook useBreakpoints</h3>
      <DisplayBreakpoint
        breakpoints={breakpoints}
        currentBreakpoint={currentBreakpoint}
      />
    </div>
  );
}

export default WithHook;
