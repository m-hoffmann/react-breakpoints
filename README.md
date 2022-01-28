# react-breakpoints-hooks

[![build](https://github.com/m-hoffmann/react-breakpoints/actions/workflows/build.yml/badge.svg)](https://github.com/m-hoffmann/react-breakpoints/actions/workflows/build.yml)
[![tests](https://github.com/m-hoffmann/react-breakpoints/actions/workflows/tests.yml/badge.svg)](https://github.com/m-hoffmann/react-breakpoints/actions/workflows/tests.yml) 

This library solves the problem that CSS media queries alone could not solve. Sometimes you want to create an application that looks a certain way on desktop and a certain way on mobile. Sometimes the components look too different for you to be able to just change the CSS, you have to make one component for desktop and another for mobile. This is bad, because the JavaScript for the hidden component is still running in the background even though you are not seeing it.

`react-breakpoints-hooks` allows you to use the viewport width to load different components, opening up for building more complex responsive applications without suffering the performance problems of hidden desktop components on your mobile site and vice versa.

Version 4.0.0 is a rewrite in typescript using react hooks uns includes the `useBreakpoint` hook.


## Installation

`npm install --save react-breakpoints-hooks`

## Usage

First you need to include the `ReactBreakpoints` component in your component tree. It expects an object that will represent your breakpoints.

```js
// index.js
import App from './App'
import ReactBreakpoints from 'react-breakpoints-hooks'

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
}

ReactDOM.render(
  <ReactBreakpoints breakpoints={breakpoints}>
    <App />
  </ReactBreakpoints>,
  document.getElementById('root'),
)
```

## Inside your components

When you want access to the current screen width inside a component you import the `withBreakpoints` function, wrapping your component when you export it. This will give you access to `props.currentBreakpoint` which updates whenever you resize your window to the point where it hits a new breakpoint, or your device orientation changes. It also adds `props.breakpoints` which is the original object which you supplied to the `ReactBreakpoints` component, so you can make comparisons with `props.currentBreakpoint`.

### Hook

```js
import { useBreakpoints } from 'react-breakpoints-hooks'

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
import { useBreakpoints } from 'react-breakpoints-hooks';

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



### Render Props

```js
import { Media } from 'react-breakpoints-hooks'

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

### HOC

```js
import { withBreakpoints } from 'react-breakpoints-hooks'

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
import { Media } from 'react-breakpoints-hooks'

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

## Server side rendering

```js
// server.js

import ReactBreakpoints from 'react-breakpoints-hooks'

const breakpoints = {
  mobile: 320,
  mobileLandscape: 480,
  tablet: 768,
  tabletLandscape: 1024,
  desktop: 1200,
  desktopLarge: 1500,
  desktopWide: 1920,
}

const guessedBreakpoint = breakpoints.mobile // create your own logic to generate this

const markup = renderToString(
  <ReactBreakpoints
    guessedBreakpoint={guessedBreakpoint}
    breakpoints={breakpoints}
  >
    <App />
  </ReactBreakpoints>,
)
```

## Options

### `breakpointUnit: string` option

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
)
```

### `debounceResize: bool` option

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
)
```

### `debounceDelay: number[ms]` option

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
)
```

### `defaultBreakpoint: number` option

In case you always want to default to a certain breakpoint.

```js
const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1025,
}

ReactDOM.render(
  <ReactBreakpoints
    breakpoints={breakpoints}
    defaultBreakpoint={breakpoints.mobile}
  >
    <App />
  </ReactBreakpoints>,
  document.getElementById('root'),
)
```
