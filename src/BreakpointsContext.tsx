import React from 'react';

import { BreakpointsProps } from './breakpoints';

const defaultContext: BreakpointsProps = {
  breakpoints: {},
  currentBreakpoint: '',
  screenWidth: undefined,
};

export const BreakpointsContext =
  React.createContext<BreakpointsProps>(defaultContext);

BreakpointsContext.displayName = 'ReactBreakpoints';
