import React, { ReactNode, Fragment } from 'react';

import { useMatchMediaQuery } from './useMatchMediaQuery';

interface MatchMediaQueryProps {
  /**
   * @example '(max-width: 600px)'
   */
  query: string;
  children: ReactNode;
}

export function MatchMediaQuery(props: MatchMediaQueryProps): JSX.Element {
  const isVisible = useMatchMediaQuery(props.query);
  return isVisible ? <Fragment>{props.children}</Fragment> : <Fragment />;
}
