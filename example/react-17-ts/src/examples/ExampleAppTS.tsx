import {
  MatchMediaBreakpoints,
  MatchBreakpoint,
  MatchMediaQuery,
  Breakpoints,
} from 'react-hook-breakpoints';

type Breakpoint =
  | 'mobile'
  | 'mobileLandscape'
  | 'tablet'
  | 'tabletLandscape'
  | 'desktop'
  | 'desktopWide'
  | 'desktopHuge';

const breakpoints: Breakpoints<Breakpoint> = {
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
    <MatchMediaBreakpoints<Breakpoint> breakpoints={breakpoints}>
      <MatchBreakpoint min="desktop">
        At least <strong>desktop</strong>
      </MatchBreakpoint>
      <MatchBreakpoint<Breakpoint> min="tablet" max="tabletLandscape">
        Between <strong>tablet</strong> and <strong>tabletLandscape</strong>
      </MatchBreakpoint>
      <MatchBreakpoint<Breakpoint> max="mobileLandscape">
        At most <strong>mobileLandscape</strong>
      </MatchBreakpoint>
      <MatchBreakpoint<Breakpoint> is="desktopWide">
        Only <strong>desktopWide</strong>
      </MatchBreakpoint>
      <MatchBreakpoint<Breakpoint> is="mobile">
        Only <strong>desktopWide</strong>
      </MatchBreakpoint>
      <MatchMediaQuery query="print">Only visible in print</MatchMediaQuery>
    </MatchMediaBreakpoints>
  );
}
