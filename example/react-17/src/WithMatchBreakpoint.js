import React from 'react';
import { MatchBreakpoint } from 'react-hook-breakpoints';

const WithMatchBreakpoint = props => {
  return (
    <div>
      <h3>With MatchBreakpoint Component</h3>
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
};

export default WithMatchBreakpoint;
