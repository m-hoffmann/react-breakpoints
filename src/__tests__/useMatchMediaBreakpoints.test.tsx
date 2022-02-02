import { renderHook, act } from '@testing-library/react-hooks';
import MatchMediaMock from 'jest-matchmedia-mock';

import {
  createMatchMediaMock,
  MatchMediaMock2,
} from './helpers/createMatchMediaMock';

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

    beforeEach(() => {
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

    it('adds a single listener for each breakpoint', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      // this allows easy detection of errors
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
  });

  describe('useMatchMediaBreakpoints (EventTarget api)', () => {
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

    beforeEach(() => {
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
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      result.unmount();
      expect(removeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('useMatchMediaBreakpoints (legacy api)', () => {
    const callbackMock = jest.fn();
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

    beforeEach(() => {
      addMock.mockClear();
      removeMock.mockClear();
      callbackMock.mockClear();
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
      const renderer = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      renderer.unmount();
      expect(removeMock).toHaveBeenCalledTimes(3);
    });

    it('executes the callback once', () => {
      addMock.mockImplementationOnce(() => callbackMock());

      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(addMock).toHaveBeenCalledTimes(3);
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('useMatchMediaBreakpoints (matchMedia not available)', () => {
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

  describe('useMatchMediaBreakpoints (EventTarget API with callbacks)', () => {
    const matchMedia = 'matchMedia';

    let matchMediaMock: MatchMediaMock2;

    beforeEach(() => {
      matchMediaMock = createMatchMediaMock();
      Object.defineProperty(global, matchMedia, {
        writable: true,
        value: matchMediaMock.matchMedia,
      });
    });

    afterEach(() => {
      matchMediaMock.cleanup();
    });

    afterAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global[matchMedia];
    });

    it('detects changes of the breakpoint', async () => {
      const breaks = { ...breakpoints };

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: breaks,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.lg);

      act(() => matchMediaMock.updateQuery(media.md));
      expect(result.result.current).toBe(names.md);

      act(() => matchMediaMock.updateQuery(media.sm));
      expect(result.result.current).toBe(names.sm);
    });
  });
});
