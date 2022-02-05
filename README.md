# react-hook-breakpoints

[![npm](https://img.shields.io/npm/v/react-hook-breakpoints.svg)](https://www.npmjs.com/package/react-hook-breakpoints)
[![build](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/build.yml/badge.svg)](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/build.yml)
[![tests](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/tests.yml/badge.svg)](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/tests.yml) 


This library solves the problem that CSS media queries alone could not solve. Sometimes you want to create an application that looks a certain way on desktop and a certain way on mobile. Sometimes the components look too different for you to be able to just change the CSS, you have to make one component for desktop and another for mobile. This is bad, because the JavaScript for the hidden component is still running in the background even though you are not seeing it.

`react-hook-breakpoints` allows you to use the viewport width to load different components, opening up for building more complex responsive applications without suffering the performance problems of hidden desktop components on your mobile site and vice versa.

Version 4 is a rewrite in typescript using react hooks uns includes the `useBreakpoint` hook.

Version 5 adds the possibility to detect the breakpoints using `window.matchMedia` instead of listening to `resize` events.

The library is tree shakeable.

## Installation

`npm install --save react-hook-breakpoints`

## Usage

### Providers

First you need to include a provider components in your component tree. It expects an object that will represent your breakpoints.

#### ReactBreakpoints

Detects the `currentBreakpoint` using `window.innerWidth` and `resize` events.

```js
import App from './App'
import ReactBreakpoints from 'react-hook-breakpoints'

// don't place this in a component without memoization
const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
};

ReactDOM.render(
  <ReactBreakpoints breakpoints={breakpoints}>
    <App />
  </ReactBreakpoints>,
  document.getElementById('root'),
);
```

#### MatchMediaBreakpoints

Detects the `currentBreakpoint` using `window.matchMedia`.

```js
import App from './App'
import { MatchMediaBreakpoints } from 'react-hook-breakpoints'

// don't place this in a component without memoization
const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
};

ReactDOM.render(
  <MatchMediaBreakpoints breakpoints={breakpoints}>
    <App />
  </MatchMediaBreakpoints>,
  document.getElementById('root'),
);
```

#### BreakpointsProps

The Providers provide props in this format.

The `currentBreakpoint` will change if the browser window is resized or
the device orientation is changed.

```js
const breakPointProps = {
  currentBreakpoint: "desktop",
  screenWidth: 1600, // always zero for MatchMediaBreakpoints
  breakPoints: {
    mobile: 320,
    mobileLandscape: 480,
    tablet: 768,
    tabletLandscape: 1024,
    desktop: 1200,
    desktopLarge: 1500,
    desktopWide: 1920,
  },
}
```

### Consumers

Consumers will allow you to to access the computed breakpoints for the current screen size

#### useBreakpoints (hook)

Access the properties directly via a hook.

Javascript example

```js
import { useBreakpoints } from 'react-hook-breakpoints'

function Navigation() {
  const { breakpoints, currentBreakpoint } = useBreakpoints();
  return breakpoints[currentBreakpoint] > breakpoints.desktop ? (
    <DesktopNavigation />
  ) : (
    <TouchNavigation />
  );
}
export default Navigation
```

Typescript example

```tsx
import { useBreakpoints } from 'react-hook-breakpoints';

type MyBreakpoints = 'desktop' | 'tablet' | 'mobile';

export function Navigation(): JSX.Element {
  const { breakpoints, currentBreakpoint } = useBreakpoints<MyBreakpoints>();
  return breakpoints[currentBreakpoint] > breakpoints.desktop ? (
    <DesktopNavigation />
  ) : (
    <TouchNavigation />
  );
}
```

#### MatchBreakpoint (component)

Renders its children if the conditions are met

```tsx
import { MatchBreakpoint } from 'react-hook-breakpoints';

export function MatchBreakpointExample() {
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
}
```

### Media (render props)

Access as child render function

```js
import { Media } from 'react-hook-breakpoints'

class Navigation extends React.Component {
  render() {
    return (
      <Media>
        {({ breakpoints, currentBreakpoint }) =>
          breakpoints[currentBreakpoint] > breakpoints.desktop ? (
            <DesktopNavigation />
          ) : (
            <TouchNavigation />
          )
        }
      </Media>
    )
  }
}

export default Navigation
```

#### withBreakpoints (HOC)

Don't use the HOC!

```js
import { withBreakpoints } from 'react-hook-breakpoints'

class Navigation extends React.Component {
  render() {
    const { breakpoints, currentBreakpoint } = this.props
    return (
      <div>
        {breakpoints[currentBreakpoint] > breakpoints.desktop ? (
          <DesktopNavigation />
        ) : (
          <TouchNavigation />
        )}
      </div>
    )
  }
}

export default withBreakpoints(Navigation)
```

Here is a more extensive example with renderProps:

```js
import { Media } from 'react-hook-breakpoints'

const MyComponent = props => (
  <div>
    <h3>Select from the list below:</h3>
    <Media>
      {({ breakpoints, currentBreakpoint }) => {
        switch (currentBreakpoint) {
          case breakpoints.mobile:
            return <MobileList />
          case breakpoints.tablet:
            return <TabletList />
          case breakpoints.desktop:
            return <DesktopList />
        }
      }}
    </Media>
  </div>
)

export default MyComponent
```

### Server side rendering

You can provide an estimation for the breakpoint, so it does not default to the smallest one.

```js
// server.js
import ReactBreakpoints from 'react-hook-breakpoints'

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
}

// create your own logic to generate this
const guessedBreakpoint = breakpoints.mobile;

const markup = renderToString(
  <ReactBreakpoints
    guessedBreakpoint={guessedBreakpoint}
    breakpoints={breakpoints}
  >
    <App />
  </ReactBreakpoints>,
)
```

or

```js
// server.js
import { MatchMediaBreakpoints } from 'react-hook-breakpoints';

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
}

 // create your own logic to generate this
const defaultBreakpoint = "tablet";

const markup = renderToString(
  <MatchMediaBreakpoints
    guessedBreakpoint={guessedBreakpoint}
    breakpoints={breakpoints}
  >
    <App />
  </MatchMediaBreakpoints>,
);
```

### Provider options

#### `breakpointUnit: string` option

Available in `ReactBreakpoints` and `MatchMediaBreakpoints`.

Set the unit type of the breakpoints. Either 'em' or 'px'. The default is 'px'.

```js
ReactDOM.render(
  <ReactBreakpoints
    breakpoints={...}
    breakpointUnit="em"
  >
    <App />
  </ReactBreakpoints>  
  , document.getElementById('root')
);
```

#### `debounceResize: bool` option

Available in `ReactBreakpoints`

By default, this library does NOT debounce the `resize` listener. However, by passing the `debounceResize` prop to the `ReactBreakpoints` component it will be enabled with a default delay.

```js
ReactDOM.render(
  <ReactBreakpoints
    breakpoints={...}
    debounceResize={true}
  >
    <App />
  </ReactBreakpoints>  
  , document.getElementById('root')
);
```

#### `debounceDelay: number[ms]` option

Available in `ReactBreakpoints`

Set a custom delay in milliseconds for how the length of the debounce wait.

```js
ReactDOM.render(
  <ReactBreakpoints
    breakpoints={...}
    debounceResize={true}
    debounceDelay={100}
  >
    <App />
  </ReactBreakpoints>  
  , document.getElementById('root')
);
```

#### `defaultBreakpoint: number` option

Available in `ReactBreakpoints`

In case you always want to default to a certain breakpoint.

```js
const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1025,
};

ReactDOM.render(
  <ReactBreakpoints
    breakpoints={breakpoints}
    defaultBreakpoint={breakpoints.mobile}
  >
    <App />
  </ReactBreakpoints>,
  document.getElementById('root'),
);
```



#### `defaultBreakpoint: string` option

Available in `MatchMediaBreakpoints`

In case you always want to default to a certain breakpoint.

```js
const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1025,
};

ReactDOM.render(
  <MatchMediaBreakpoints
    breakpoints={breakpoints}
    defaultBreakpoint={"mobile"}
  >
    <App />
  </MatchMediaBreakpoints>,
  document.getElementById('root'),
);
```

### Standalone component

Use media queries directly. 

**_Disclaimer_**:
Adds one event listener for each use of this component, so performance might become
and issue if you use this everywhere.

```tsx
import { MatchMediaQuery } from 'react-hook-breakpoints';

export default function MatchMediaQueryExample(): JSX.Element {
  return (
    <div>
      <h2 className="App-title">
        Standalone component that window.matchMedia to detect breakpoints
      </h2>

      <MatchMediaQuery query="screen and (min-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible for screens larger 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="(max-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible for screens smaller than 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="(min-width: 600px) and (max-width: 800px)">
        <h1>MatchMediaQuery</h1>
        <div>Visible between 600px and 800px</div>
      </MatchMediaQuery>

      <MatchMediaQuery query="print">
        <div>Only rendered in print</div>
      </MatchMediaQuery>
    </div>
  );
}
```