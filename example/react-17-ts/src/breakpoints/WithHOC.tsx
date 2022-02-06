import { withBreakpoints, WithBreakpointsProps } from 'react-hook-breakpoints';
import { DisplayBreakpoint } from './DisplayBreakpoint';

function WithHOC({ breakpoints, currentBreakpoint }: WithBreakpointsProps) {
  return (
    <div>
      <h3>
        <code>withBreakpoints</code>
        <br />
        <small>HOC</small>
      </h3>
      <DisplayBreakpoint
        breakpoints={breakpoints}
        currentBreakpoint={currentBreakpoint}
      />
    </div>
  );
}

export default withBreakpoints(WithHOC);
