import { renderHook } from '@testing-library/react-hooks';
import { useDetectCurrentBreakpoint } from '../useDetectCurrentBreakpoint';

describe('useDetectCurrentBreakpoint', () => {
  it('returns "mobile" with 0x0', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const { result } = renderHook(() =>
      useDetectCurrentBreakpoint({
        breakpoints,
        screenSize: { width: 0, height: 0 },
        breakpointUnit: 'px',
        defaultBreakpoint: 0,
        guessedBreakpoint: 0,
      }),
    );

    expect(result.current).toMatch('mobile');
  });

  it('returns "tablet" with 0x0', async function () {
    const breakpoints = {
      mobile: 320,
      tablet: 768,
      desktop: 1200,
    };

    const { result } = renderHook(() =>
      useDetectCurrentBreakpoint({
        breakpoints,
        screenSize: { width: 800, height: 600 },
        breakpointUnit: 'px',
        defaultBreakpoint: 0,
        guessedBreakpoint: 0,
      }),
    );

    expect(result.current).toMatch('tablet');
  });
});
