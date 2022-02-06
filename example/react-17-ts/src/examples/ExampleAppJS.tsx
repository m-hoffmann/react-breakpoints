import {
  MatchMediaBreakpoints,
  MatchBreakpoint,
  MatchMediaQuery,
} from 'react-hook-breakpoints';

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopWide: 1500,
  desktopHuge: 1920,
};

export default function ExampleApp() {
  return (
    <MatchMediaBreakpoints breakpoints={breakpoints}>
      <MatchBreakpoint min="desktop">
        At least <strong>desktop</strong>
      </MatchBreakpoint>
      <MatchBreakpoint min="tablet" max="tabletLandscape">
        Between <strong>tablet</strong> and <strong>tabletLandscape</strong>
      </MatchBreakpoint>
      <MatchBreakpoint max="mobileLandscape">
        At most <strong>mobileLandscape</strong>
      </MatchBreakpoint>
      <MatchBreakpoint is="desktopWide">
        Only <strong>desktopWide</strong>
      </MatchBreakpoint>
      <MatchBreakpoint is="mobile">
        Only <strong>desktopWide</strong>
      </MatchBreakpoint>
      <MatchMediaQuery query="print">Only visible in print</MatchMediaQuery>
    </MatchMediaBreakpoints>
  );
}
