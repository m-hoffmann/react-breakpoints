import React, { ComponentType, useContext } from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { BreakpointKey, BreakpointsProps } from './breakpoints';
import { BreakpointsContext } from './BreakpointsContext';

/**
 * HOC for providing breakpoints as props
 */
export function withBreakpoints<
  K extends BreakpointKey = BreakpointKey,
  P extends BreakpointsProps<K> = BreakpointsProps<K>,
>(
  Component: ComponentType<P & BreakpointsProps<K>>,
): ComponentType<Omit<P, keyof BreakpointsProps<K>>> {
  function WrapperComponent(props: Omit<P, keyof BreakpointsProps<K>>) {
    const contextProps = useContext(BreakpointsContext) as BreakpointsProps<K>;
    return <Component {...contextProps} {...(props as P)} />;
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
