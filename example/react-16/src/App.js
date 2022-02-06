import React, { Component } from 'react';
import './App.css';

import {
  WindowSizeBreakpoints,
  MatchMediaBreakpoints,
  MatchMediaQuery,
  Media,
  useBreakpoints,
  withBreakpoints,
  MatchBreakpoint,
} from 'react-hook-breakpoints';

// declare breakpoints
const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopWide: 1500,
  desktopHuge: 1920,
};

function WithRenderProps() {
  return <Media>{() => <div>WithRenderProps</div>}</Media>;
}

function WithHook() {
  useBreakpoints();
  return <div>WithHook</div>;
}

const WithHoc = withBreakpoints(function Dummy() {
  return <div>WithHoc</div>;
});

function All() {
  return (
    <div>
      <WithHoc />
      <WithRenderProps />
      <WithHook />
      <MatchBreakpoint is="desktop" />
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <WindowSizeBreakpoints breakpoints={breakpoints}>
          <h1>ReactBreakpoints</h1>
          <All />
        </WindowSizeBreakpoints>
        <MatchMediaBreakpoints breakpoints={breakpoints}>
          <h1>MatchMediaBreakpoints</h1>
          <All />
        </MatchMediaBreakpoints>
        <MatchMediaQuery query="screen and (min-width: 800px)">
          <h1>MatchMediaQuery</h1>
          <div>div</div>
        </MatchMediaQuery>
      </div>
    );
  }
}

export default App;
