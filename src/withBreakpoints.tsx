import React, { ComponentType, useContext } from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { BreakpointKey, BreakpointsProps } from './breakpoints';
import { BreakpointsContext } from './BreakpointsContext';

/**
 * HOC for providing breakpoints as props
 */
export function withBreakpoints<P, K extends BreakpointKey = BreakpointKey>(
  Component: ComponentType<P>,
): ComponentType<P & BreakpointsProps<K>> {
  function WrapperComponent(props: P) {
    const contextProps = useContext(BreakpointsContext);
    return <Component {...props} {...contextProps} />;
  }

  // copy displayname of wrapped component
  WrapperComponent.displayName = `withBreakpoints(${
    Component.displayName || Component.name
  })`;

  // copy non-react static properties on the new component
  return hoistStatics(WrapperComponent, Component);
}

/**
 * Pass in the keys of your breakpoints as K
 */
export type WithBreakpointsProps<K extends BreakpointKey = BreakpointKey> =
  BreakpointsProps<K>;
