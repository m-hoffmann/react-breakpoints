import {
  createLegacyMediaMock,
  createMatchMediaMock,
  createMediaMockWithoutApi,
  createMediaQueryListMock,
  MatchMediaMock2,
} from './MatchMediaMock2';

// we need these tests for coverage

describe('MatchMediaMock2', () => {
  describe('createMediaQueryListMock', () => {
    let mock: MatchMediaMock2;

    beforeEach(() => {
      mock = createMediaQueryListMock();
    });

    it('has property numCalls', () => {
      expect(mock.numCalls).toBe(0);
    });

    it('has property numListeners', () => {
      expect(mock.numListeners).toBe(0);
    });

    it('has property mediaQuery and its initial value is the empty string', () => {
      expect(mock.mediaQuery).toBe('');
    });

    it('property mediaQuery can bet set', () => {
      mock.mediaQuery = '(width: 10px)';
      expect(mock.mediaQuery).toBe('(width: 10px)');
    });

    describe('matchMedia', () => {
      it('has property media', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.media).toBe('foo');
      });

      it('has property matches', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.matches).toBe(false);
      });

      it('has property dispatchEvent', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.dispatchEvent).toBeDefined();
      });

      it('dispatchEvent can be called and returns true', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.dispatchEvent(new Event('foo'))).toBe(true);
      });

      it('has property onchange', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.onchange).toBe(null);
      });

      it('if onchange is called when set', () => {
        mock.mediaQuery = 'bar';
        const mql = mock.matchMedia('foo');
        const onChange = jest.fn();
        mql.onchange = onChange;
        mock.mediaQuery = 'foo';
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('createMatchMediaMock', () => {
    let mock: MatchMediaMock2;

    beforeEach(() => {
      mock = createMatchMediaMock();
    });

    describe('mediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.mediaQuery = 'bar';
        expect(mql.matches).toBe(true);
      });
    });
  });

  describe('createLegacyMediaMock', () => {
    let mock: MatchMediaMock2;

    beforeEach(() => {
      mock = createLegacyMediaMock();
    });

    it('has property numCalls', () => {
      expect(mock.numCalls).toBe(0);
    });

    it('has property numListeners', () => {
      expect(mock.numListeners).toBe(0);
    });

    describe('matchMedia', () => {
      it('has property media', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.media).toBe('foo');
      });

      it('has property matches', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.matches).toBe(false);
      });

      it('is missing addEventListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.addEventListener).toBe(undefined);
      });

      it('is missing removeEventListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.removeEventListener).toBe(undefined);
      });

      it('has property addListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.addListener).toBeDefined();
      });

      it('has property removeListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.removeListener).toBeDefined();
      });

      it('is missing onchange', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.onchange).toBe(undefined);
      });

      it('is missing dispatchEvent', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.dispatchEvent).toBe(undefined);
      });
    });

    describe('mediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.mediaQuery = 'bar';
        expect(mql.matches).toBe(true);
      });
    });
  });

  describe('createMediaMockWithoutApi', () => {
    let mock: MatchMediaMock2;

    beforeEach(() => {
      mock = createMediaMockWithoutApi();
    });

    it('has property numCalls', () => {
      expect(mock.numCalls).toBe(0);
    });

    it('has property numListeners', () => {
      expect(mock.numListeners).toBe(0);
    });

    describe('matchMedia', () => {
      it('has property media', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.media).toBe('foo');
      });

      it('has property matches', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.matches).toBe(false);
      });

      it('is missing addEventListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.addEventListener).toBe(undefined);
      });

      it('is missing removeEventListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.removeEventListener).toBe(undefined);
      });

      it('is missing addListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.addListener).toBe(undefined);
      });

      it('is missing removeListener', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.removeListener).toBe(undefined);
      });

      it('is missing onchange', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.onchange).toBe(undefined);
      });

      it('is missing dispatchEvent', () => {
        const mql = mock.matchMedia('foo');
        expect(mql.dispatchEvent).toBe(undefined);
      });
    });

    describe('mediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.mediaQuery = 'bar';
        expect(mql.matches).toBe(true);
      });
    });
  });
});
