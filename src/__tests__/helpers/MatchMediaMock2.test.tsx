import {
  createLegacyMediaMock,
  createMatchMediaMock,
  createMediaMockWithoutApi,
  MatchMediaMock2,
} from './MatchMediaMock2';

// we need these tests for coverage

describe('MatchMediaMock2', () => {
  describe('createMatchMediaMock', () => {
    let mock: MatchMediaMock2;

    beforeEach(() => {
      mock = createMatchMediaMock();
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
    });

    describe('useMediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.useMediaQuery('bar');
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
    });

    describe('useMediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.useMediaQuery('bar');
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
    });

    describe('useMediaQuery', () => {
      it('updates matches', () => {
        const mql = mock.matchMedia('bar');
        mock.useMediaQuery('bar');
        expect(mql.matches).toBe(true);
      });
    });
  });
});
