import { createContext } from 'react';

import { BreakpointsProps } from './breakpoints';

const defaultContext: BreakpointsProps = {
  breakpoints: {},
  currentBreakpoint: '',
};

export const BreakpointsContext =
  createContext<BreakpointsProps>(defaultContext);

BreakpointsContext.displayName = 'ReactBreakpoints';
