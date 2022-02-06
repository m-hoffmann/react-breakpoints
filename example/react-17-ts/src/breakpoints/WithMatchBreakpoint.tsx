import { MatchBreakpoint } from 'react-hook-breakpoints';

function WithMatchBreakpoint() {
  return (
    <div>
      <h3>
        <code>MatchBreakpoint</code>
        <br />
        <small>component that renders its children</small>
      </h3>
      <MatchBreakpoint is="desktop">
        <p>
          Only <strong>desktop</strong>
        </p>
      </MatchBreakpoint>
      <MatchBreakpoint min="tablet">
        <p>
          At least <strong>tablet</strong>
        </p>
      </MatchBreakpoint>
      <MatchBreakpoint max="tablet">
        <p>
          Not <strong>tablet</strong>
        </p>
      </MatchBreakpoint>
      <MatchBreakpoint min="mobile" max="desktop">
        <p>
          Mobile or <strong>tablet</strong>
        </p>
      </MatchBreakpoint>
      <MatchBreakpoint min="tablet" not="desktop">
        <p>
          At least <strong>tablet</strong> but not <strong>desktop</strong>
        </p>
      </MatchBreakpoint>
    </div>
  );
}

export default WithMatchBreakpoint;
