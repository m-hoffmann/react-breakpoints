import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// import Provider
import { MediaMatchBreakpointsProvider } from 'react-hook-breakpoints';
import ReactBreakpoints from 'react-hook-breakpoints';

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

ReactDOM.render(
  <div className="row">
    <div className="col">
      <MediaMatchBreakpointsProvider breakpoints={breakpoints}>
        <App
          title={'MediaMatchBreakpointsProvider'}
          description={'Uses window.matchMedia'}
        />
      </MediaMatchBreakpointsProvider>
    </div>
    <div className="col">
      <code></code>
      <ReactBreakpoints breakpoints={breakpoints}>
        <App
          title={'ReactBreakpoints'}
          description={'Uses window.innerWidth'}
        />
      </ReactBreakpoints>
    </div>
  </div>,
  document.getElementById('root'),
);
registerServiceWorker();
