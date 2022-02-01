import { renderHook } from '@testing-library/react-hooks';
import MatchMediaMock from 'jest-matchmedia-mock';

import { delay } from './helpers/delay';
// import { defer } from './helpers/defer';

import { useMatchMediaBreakpoints } from '../useMatchMediaBreakpoints';
import { minWidth, maxWidth, minMaxWidth } from '../media-utils';

describe('useMatchMediaBreakpoints', () => {
  const breakpointUnit = 'px';
  const names = { sm: 'sm', md: 'md', lg: 'lg' };
  const breakpoints = { sm: 10, md: 20, lg: 30 };
  const media = {
    sm: maxWidth(breakpoints.md, breakpointUnit),
    md: minMaxWidth(breakpoints.md, breakpoints.lg, breakpointUnit),
    lg: minWidth(breakpoints.lg, breakpointUnit),
  };

  describe('useMatchMediaBreakpoints (functional mock API)', () => {
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

    it('detects single breakpoint', () => {
      matchMediaMock.useMediaQuery(minWidth(1000, 'em'));
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit: 'em',
        }),
      );

      expect(result.result.current).toBe('single');
    });

    it('detects breakpoint sm', () => {
      matchMediaMock.useMediaQuery(media.sm);
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.sm);
    });

    it('detects breakpoint md', () => {
      matchMediaMock.useMediaQuery(media.md);
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.md);
    });

    it('detects breakpoint lg', () => {
      matchMediaMock.useMediaQuery(media.lg);
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe('lg');
    });

    it.skip('detects changes of the breakpoint', async () => {
      matchMediaMock.useMediaQuery(media.lg);

      const breaks = { ...breakpoints, xs: 1 };

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: breaks,
          breakpointUnit,
        }),
      );

      // verify lg
      expect(result.result.current).toBe(names.lg);
      result.rerender();
      // update to md
      // defer(() => matchMediaMock.useMediaQuery(media.md), 5);
      matchMediaMock.useMediaQuery(media.md);
      result.rerender();
      // await result.waitForNextUpdate();
      // expect(result.result.current).toBe(names.md);

      // update to sm
      // defer(() => matchMediaMock.useMediaQuery(media.sm), 10);

      matchMediaMock.useMediaQuery(media.sm);
      result.rerender();

      result.rerender();
      // await result.waitForNextUpdate();
      // expect(result.result.current).toBe(names.sm);
      // await result.waitForNextUpdate();

      await delay(100);

      expect(result.result.all).toBe([names.lg]);
    });

    it('adds a single listener for each breakpoint', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      // this allows easyy detection of errors
      const registeredMediaQueries = matchMediaMock
        .getMediaQueries()
        .join(' # ');
      expect(registeredMediaQueries).toContain(media.sm);
      expect(registeredMediaQueries).toContain(media.md);
      expect(registeredMediaQueries).toContain(media.lg);

      // verify that there is a single listener per query
      expect(matchMediaMock.getListeners(media.sm)?.length).toBe(1);
      expect(matchMediaMock.getListeners(media.md)?.length).toBe(1);
      expect(matchMediaMock.getListeners(media.lg)?.length).toBe(1);
    });

    it.skip('removes all event listeners on unnmount', () => {
      const renderer = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      // unmount the component and verify that the listeners are removed
      renderer.unmount();

      // FIXME: fails, but why?
      // expect(matchMediaMock.getMediaQueries().length).toBe(0);
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

    it('detects the single breakpoint', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit: 'px',
        }),
      );

      expect(result.result.current).toBe('single');
    });

    it('adds event listeners', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );
      expect(addMock).toHaveBeenCalledTimes(3);
    });

    it('removes event listeners', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );
      expect(removeMock).toHaveBeenCalledTimes(3);
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

    it('detects the single breakpoint', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit: 'px',
        }),
      );

      expect(result.result.current).toBe('single');
    });

    it('adds event listeners', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(addMock).toHaveBeenCalledTimes(3);
    });

    it('removes event listeners', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(removeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('MatchMediaQuery (matchMedia not available)', () => {
    it('detects the single breakpoint', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit: 'px',
        }),
      );

      expect(result.result.current).toBe('single');
    });
  });
});
