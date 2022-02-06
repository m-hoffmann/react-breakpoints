import { WindowSizeBreakpoints } from 'react-hook-breakpoints';
import BreakpointsApp from './breakpoints/App';

// breakpoints
const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopWide: 1500,
  desktopHuge: 1920,
};

export default function AppWindowSizeBreakpoints() {
  return (
    <WindowSizeBreakpoints breakpoints={breakpoints}>
      <h2 className="App-title">
        Provider for breakpoints using window.innerWidth
      </h2>
      <p className="App-intro"></p>
      <BreakpointsApp />
    </WindowSizeBreakpoints>
  );
}
