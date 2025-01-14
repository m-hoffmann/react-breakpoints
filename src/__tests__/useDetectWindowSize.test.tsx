import { renderHook } from '@testing-library/react-hooks';
import { useDetectWindowSize } from '../useDetectWindowSize';

describe('useDetectWindowSize', () => {
  // this is just for 100% coverage
  it('returns 0x0 without window', async function () {
    const { result } = renderHook(() =>
      useDetectWindowSize({ ignoreWindowSize: true }),
    );

    expect(result.current).toMatchObject({ width: 0, height: 0 });
  });

  it('returns 800x600', async function () {
    global.innerWidth = 800;
    global.innerHeight = 600;

    const { result } = renderHook(() =>
      useDetectWindowSize({ ignoreWindowSize: false }),
    );

    expect(result.current).toMatchObject({ width: 800, height: 600 });
  });
});
