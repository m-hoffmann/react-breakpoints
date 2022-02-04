import { renderHook, act } from '@testing-library/react-hooks';

import {
  createLegacyMediaMock,
  createMatchMediaMock,
  createMediaMockWithoutApi,
  MatchMediaMock2,
  addMockToGlobal,
  removeMockFromGlobal,
} from './helpers/MatchMediaMock2';

import { useMatchMediaBreakpoints } from '../useMatchMediaBreakpoints';
import { createBreakpointQueryObject } from '../media-utils';

describe('useMatchMediaBreakpoints', () => {
  const breakpointUnit = 'px';
  const names = { sm: 'sm', md: 'md', lg: 'lg' };
  const breakpoints = { sm: 320, md: 640, lg: 1200 };
  const media = createBreakpointQueryObject(breakpoints, breakpointUnit);

  describe('useMatchMediaBreakpoints (EventTarget api)', () => {
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

    it('detects the single breakpoint', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit: 'px',
        }),
      );

      expect(result.result.current).toBe('single');
    });

    it('detects breakpoint if no breakpoint matches', () => {
      matchMediaMock.mediaQuery = 'not all';

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.sm);
    });

    it('detects breakpoint sm', () => {
      matchMediaMock.mediaQuery = media.sm;

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.sm);
    });

    it('detects breakpoint md', () => {
      matchMediaMock.mediaQuery = media.md;

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.md);
    });

    it('detects breakpoint lg', () => {
      matchMediaMock.mediaQuery = media.lg;

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe('lg');
    });

    it('adds a single event listeners for a single breakpoint', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: { single: 1 },
          breakpointUnit,
        }),
      );

      expect(matchMediaMock.numListeners).toBe(1);
    });

    it('adds event listeners', () => {
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(matchMediaMock.numListeners).toBe(3);
    });

    it('removes event listeners', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      result.unmount();
      expect(matchMediaMock.numListeners).toBe(0);
    });

    it('detects changes of the breakpoint', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      act(() => {
        matchMediaMock.mediaQuery = media.md;
      });
      expect(result.result.current).toBe(names.md);

      act(() => {
        matchMediaMock.mediaQuery = media.sm;
      });
      expect(result.result.current).toBe(names.sm);
    });
  });

  describe('useMatchMediaBreakpoints (legacy api)', () => {
    let matchMediaMock: MatchMediaMock2;

    beforeEach(() => {
      matchMediaMock = createLegacyMediaMock();
      addMockToGlobal(matchMediaMock.matchMedia);
    });

    afterEach(() => {
      matchMediaMock.cleanup();
    });

    afterAll(() => {
      removeMockFromGlobal();
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
      expect(matchMediaMock.numListeners).toBe(3);
    });

    it('removes event listeners', () => {
      const renderer = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      renderer.unmount();
      expect(matchMediaMock.numListeners).toBe(0);
    });

    it('executes the callback', () => {
      matchMediaMock.mediaQuery = 'not all';

      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      act(() => {
        matchMediaMock.mediaQuery = 'all';
      });
      expect(matchMediaMock.numCalls).toBe(3);
    });
  });

  describe('useMatchMediaBreakpoints (no events)', () => {
    let matchMediaMock: MatchMediaMock2;

    beforeEach(() => {
      matchMediaMock = createMediaMockWithoutApi();
      addMockToGlobal(matchMediaMock.matchMedia);
    });

    afterEach(() => {
      matchMediaMock.cleanup();
    });

    afterAll(() => {
      removeMockFromGlobal();
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

    it('uses default breakpoint if no breakpoint is available', () => {
      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit: 'px',
          defaultBreakpoint: 'md',
        }),
      );

      expect(result.result.current).toBe('md');
    });
  });
});
