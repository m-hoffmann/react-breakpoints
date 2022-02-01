import React from 'react';
import { render, act } from '@testing-library/react';

import MatchMediaMock from 'jest-matchmedia-mock';

import { MatchMediaQuery } from '../MatchMediaQuery';

describe('MatchMediaQuery', () => {
  describe('MatchMediaQuery (functional mock API)', () => {
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

  describe('MatchMediaQuery (EventTarget api)', () => {
    const addMock = jest.fn();
    const removeMock = jest.fn();
    const matchMedia = 'matchMedia';

    beforeAll(() => {
      Object.defineProperty(global, matchMedia, {
        writable: true,
        value: (query: string) => {
          return {
            matches: false,
            media: query,
            onchange: null,
            addEventListener: addMock,
            removeEventListener: removeMock,
          };
        },
      });
    });

    afterEach(() => {
      addMock.mockClear();
      removeMock.mockClear();
    });

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global[matchMedia];
    });

    it('adds event listeners', () => {
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
      expect(addMock).toHaveBeenCalledTimes(2);
    });

    it('removes event listeners', () => {
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
      expect(removeMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('MatchMediaQuery (legacy api)', () => {
    const addMock = jest.fn();
    const removeMock = jest.fn();
    const matchMedia = 'matchMedia';

    beforeAll(() => {
      Object.defineProperty(global, matchMedia, {
        writable: true,
        value: (query: string) => {
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener: addMock,
            removeListener: removeMock,
          };
        },
      });
    });

    afterEach(() => {
      addMock.mockClear();
      removeMock.mockClear();
    });

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global[matchMedia];
    });

    it('adds event listeners', () => {
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
      expect(addMock).toHaveBeenCalledTimes(2);
    });

    it('removes event listeners', () => {
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
      expect(removeMock).toHaveBeenCalledTimes(2);
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
