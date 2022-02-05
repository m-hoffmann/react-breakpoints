import { ERRORS } from './messages';

import { BreakpointMap } from '../breakpoints';

/**
 * Throw Error if no breakpoints were passed
 * @param breakpoints
 */
export function validateBreakpoints(breakpoints: BreakpointMap): void {
  // throw Error if no breakpoints were passed
  if (!breakpoints) {
    throw new Error(ERRORS.NO_BREAKPOINTS);
  }

  // throw Error if breakpoints is not an object
  if (typeof breakpoints !== 'object') {
    throw new Error(ERRORS.NOT_OBJECT);
  }

  // throw Error if breakpoints has no properties
  if (Object.keys(breakpoints).length === 0) {
    throw new Error(ERRORS.EMPTY_OBJECT);
  }
}