import { ReactNode, Fragment } from 'react';

import { useMatchMediaQuery } from './useMatchMediaQuery';

/**
 * Standalone component for matching a media query
 */
export interface MatchMediaQueryProps {
  /**
   * @example '(max-width: 600px)'
   */
  query: string;
  children: ReactNode;
}

/**
 * Standalone component for matching a media query
 *
 * Renders its children if the query matches
 * @param props
 * @returns
 * @example <MatchMediaQuery query={"(min-width: 600px"} />
 */
export function MatchMediaQuery(props: MatchMediaQueryProps): JSX.Element {
  const isVisible = useMatchMediaQuery(props.query);
  return isVisible ? <Fragment>{props.children}</Fragment> : <Fragment />;
}
