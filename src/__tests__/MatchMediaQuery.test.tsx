import React from 'react';
import { render, act } from '@testing-library/react';

import {
  createMatchMediaMock,
  addMockToGlobal,
  removeMockFromGlobal,
  MatchMediaMock2,
} from './helpers/MatchMediaMock2';

import { MatchMediaQuery } from '../MatchMediaQuery';

describe('MatchMediaQuery', () => {
  describe('MatchMediaQuery (functional mock API)', () => {
    let matchMediaMock: MatchMediaMock2;

    beforeEach(() => {
      matchMediaMock = createMatchMediaMock();
      addMockToGlobal(matchMediaMock.matchMedia);
    });

    afterEach(() => {
      matchMediaMock.cleanup();
    });

    afterAll(() => {
      removeMockFromGlobal();
    });

    it('does show inner div if query is satisfied', () => {
      act(() => {
        matchMediaMock.mediaQuery = 'yes';
      });
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
      act(() => {
        matchMediaMock.mediaQuery = 'yes';
      });
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
      act(() => {
        matchMediaMock.mediaQuery = 'no';
      });

      const result = render(
        <div>
          <MatchMediaQuery query="yes">
            <div>inner</div>
          </MatchMediaQuery>
        </div>,
      );

      expect(result.queryByText('inner')).toBeFalsy();

      act(() => {
        matchMediaMock.mediaQuery = 'yes';
      });

      expect(result.queryByText('inner')).toBeTruthy();
    });
  });

  describe('MatchMediaQuery (matchMedia not available)', () => {
    it('does not explode', () => {
      expect(() => {
        render(
          <div>
            <MatchMediaQuery query="yes">
              <div>inner</div>
            </MatchMediaQuery>
            <MatchMediaQuery query="no">
              <div>inner</div>
            </MatchMediaQuery>
          </div>,
        );
      }).not.toThrow();
    });
  });
});
