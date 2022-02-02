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

    it('detects breakpoint sm', () => {
      act(() => matchMediaMock.useMediaQuery(media.sm));

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.sm);
    });

    it('detects breakpoint md', () => {
      act(() => matchMediaMock.useMediaQuery(media.md));

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.md);
    });

    it('detects breakpoint lg', () => {
      act(() => matchMediaMock.useMediaQuery(media.lg));

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe('lg');
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

    it('detects changes of the breakpoint', async () => {
      const breaks = { ...breakpoints };

      const result = renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints: breaks,
          breakpointUnit,
        }),
      );

      expect(result.result.current).toBe(names.lg);

      act(() => matchMediaMock.useMediaQuery(media.md));
      expect(result.result.current).toBe(names.md);

      act(() => matchMediaMock.useMediaQuery(media.sm));
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
      renderHook(() =>
        useMatchMediaBreakpoints({
          breakpoints,
          breakpointUnit,
        }),
      );

      matchMediaMock.useMediaQuery('bla bla bla');
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
  });
});
