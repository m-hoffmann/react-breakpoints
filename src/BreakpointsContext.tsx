import { createContext } from 'react';

import { BreakpointsProps } from './breakpoints';

const defaultContext: BreakpointsProps = {
  breakpoints: {},
  currentBreakpoint: '',
  screenWidth: 0,
};

export const BreakpointsContext =
  createContext<BreakpointsProps>(defaultContext);

BreakpointsContext.displayName = 'ReactBreakpoints';
