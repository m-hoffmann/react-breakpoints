# react-hook-breakpoints

[![npm](https://img.shields.io/npm/v/react-hook-breakpoints.svg)](https://www.npmjs.com/package/react-hook-breakpoints)
[![build](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/build.yml/badge.svg)](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/build.yml)
[![tests](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/tests.yml/badge.svg)](https://github.com/m-hoffmann/react-hook-breakpoints/actions/workflows/tests.yml) 


This library solves the problem that CSS media queries alone could not solve. Sometimes you want to create an application that looks a certain way on desktop and a certain way on mobile. Sometimes the components look too different for you to be able to just change the CSS, you have to make one component for desktop and another for mobile. This is bad, because the JavaScript for the hidden component is still running in the background even though you are not seeing it.

`react-hook-breakpoints` allows you to use the viewport width to load different components, opening up for building more complex responsive applications without suffering the performance problems of hidden desktop components on your mobile site and vice versa.

**Version 4**

Is a rewrite in typescript using react hooks and includes the `useBreakpoints` hook.

**Version 5**

Adds the possibility to detect the breakpoints using `window.matchMedia` instead of listening to `resize` events and adds some new alternatives to simplify the usage of the library.

Version 5 is tree shakeable.

## Installation

`npm install --save react-hook-breakpoints`

## Usage

### tl;dr 

Javascript

```jsx
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

```

Typescript

```tsx
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
```

### MatchMediaBreakpoints

First you need to include a provider components in your component tree. It expects an object that will represent your breakpoints.

Detects the current breakpoint using media queries

 - [matchMedia]( https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
 - [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList)

 Uses CSS media queries [level 3](https://www.w3.org/TR/css3-mediaqueries/)
 - `min-width`
 - `max-width`
 
```js
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

export default function App() {
  return (
    <MatchMediaBreakpoints breakpoints={breakpoints}>
      <AppContent />
    </MatchMediaBreakpoints>
  ); 
}
```

You can als use the [legacy provider](#WindowSizeBreakpoints)

### BreakpointsProps


The Provider provides props in this format.

```js
const breakPointProps = {
  currentBreakpoint: "desktop",
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

The `currentBreakpoint` can change if the browser window is resized or
the device orientation is changed.

### Consumers

Consumers will allow you to to access the computed breakpoint

### useBreakpoints

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

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export function Navigation(): JSX.Element {
  const { breakpoints, currentBreakpoint } = useBreakpoints<Breakpoint>();
  return breakpoints[currentBreakpoint] > breakpoints.desktop ? (
    <DesktopNavigation />
  ) : (
    <TouchNavigation />
  );
}
```

Option `breakpointUnit: string` option

Set the unit type of the breakpoints. Either 'em' or 'px'. The default is 'px'.

```xml
<ReactBreakpoints breakpoints={breakpoints} breakpointUnit="em">
  <AppContent />
</ReactBreakpoints>  
);
```

Option `defaultBreakpoint: string`

In case you always want to default to a certain breakpoint.
The default will be the smallest breakpoint provided.

```xml
<MatchMediaBreakpoints breakpoints={breakpoints} defaultBreakpoint="mobile">
  <AppContent />
</MatchMediaBreakpoints>
```

You can provide an estimation for the breakpoint, so it does not default to the smallest one.

This can be useful in SSR.

```jsx
import { MatchMediaBreakpoints } from 'react-hook-breakpoints';

const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1200,
}

 // create your own logic to generate this
const defaultBreakpoint = "tablet";

const markup = renderToString(
  <MatchMediaBreakpoints defaultBreakpoint={defaultBreakpoint} breakpoints={breakpoints}>
    <AppContent />
  </MatchMediaBreakpoints>,
);
```

#### MatchBreakpoint

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

### MatchMediaQuery

Use media queries directly. Does not depend on a provider in the react tree.

**_Disclaimer_**:
Adds one event listener for each use of this component, so performance might become
and issue if you use this everywhere.

```tsx
import { MatchMediaQuery } from 'react-hook-breakpoints';

export default function MatchMediaQueryExample(): JSX.Element {
  return (
    <div>
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

### Legacy components

These components can still be used, but might be deprecated in the future.

#### WindowSizeBreakpoints

Default export before version 5.

Detects the current breakpoint
using [window.innerWidth](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
and the window events
- [resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event)
- [orientationchange](https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event)

```js
import { WindowSizeBreakpoints } from 'react-hook-breakpoints'

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

export default function App() {
  return (
    <WindowSizeBreakpoints breakpoints={breakpoints}>
      <AppContent />
    </WindowSizeBreakpoints>
  );
}
```

Options for debouncing

- `debounceResize: boolean`, defaults `false`
- `debounceDelay: number` in milliseconds, default `50`

By default, this library does NOT debounce the `resize` listener. However, by passing the `debounceResize` prop to the `ReactBreakpoints` component it will be enabled with a default delay.

You can set a custom delay in milliseconds for how the length of the debounce wait.

```xml
<WindowSizeBreakpoints breakpoints={breakpoints} debounceResize={true} debounceDelay={250}>
  <AppContent />
</WindowSizeBreakpoints>
```


Option `defaultBreakpoint: number`

In case you want to default to a certain breakpoint.

```xml
<WindowSizeBreakpoints breakpoints={breakpoints} defaultBreakpoint={320}>
  <AppContent />
</WindowSizeBreakpoints>
```


### Media

Access the `BreakpointsProps` as render prop children.

```js
import { Media } from 'react-hook-breakpoints'

export function Navigation() {
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
```

#### withBreakpoints (HOC)

The `withBreakpoints` HOC injects the `BreakpointsProps` in the props of the wrapped component.

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