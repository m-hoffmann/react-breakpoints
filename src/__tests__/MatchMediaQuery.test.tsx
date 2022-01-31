import React from 'react';
import { render, act } from '@testing-library/react';

import MatchMediaMock from 'jest-matchmedia-mock';

import { MatchMediaQuery } from '../MatchMediaQuery';

describe('MatchMediaQuery', () => {
  /**
   * jsdom does not support this event
   */
  let matchMediaMock: MatchMediaMock;

  beforeAll(() => {
    matchMediaMock = new MatchMediaMock();
  });

  afterEach(() => {
    matchMediaMock.clear();
  });

  afterAll(() => {
    matchMediaMock.destroy();
  });

  it('does show inner div if query is satisfied', () => {
    matchMediaMock.useMediaQuery('yes');
    const result = render(
      <div>
        <MatchMediaQuery query="yes">
          <div>inner</div>
        </MatchMediaQuery>
      </div>,
    );

    expect(result.queryByText('inner')).toBeTruthy();
  });

  it('does not show inner div if query is not satisfied', () => {
    matchMediaMock.useMediaQuery('yes');
    const result = render(
      <div>
        <MatchMediaQuery query="no">
          <div>inner</div>
        </MatchMediaQuery>
      </div>,
    );

    expect(result.queryByText('inner')).toBeFalsy();
  });

  it('detects changes change from events', () => {
    matchMediaMock.useMediaQuery('no');

    const result = render(
      <div>
        <MatchMediaQuery query="yes">
          <div>inner</div>
        </MatchMediaQuery>
      </div>,
    );

    expect(result.queryByText('inner')).toBeFalsy();

    act(() => {
      matchMediaMock.useMediaQuery('yes');
    });

    result.rerender(
      <div>
        <MatchMediaQuery query="yes">
          <div>inner</div>
        </MatchMediaQuery>
      </div>,
    );

    expect(result.queryByText('inner')).toBeTruthy();
  });
});
