import { EventEmitter2, ListenerFn } from 'eventemitter2';

export interface MatchMediaMock2 {
  matchMedia(media: string): Partial<MediaQueryList>;
  useMediaQuery(query: string): void;
  cleanup(): void;
  numListeners: number;
  numCalls: number;
}

type ChangeEventListener = (event: MediaQueryListEvent) => void;

const MEDIA_EVENT = 'media';
const CHANGE_EVENT = 'change';

/**
 * Create a partially working mock for matchMedia
 * with EventTarget functions
 * - addEventListener
 * - removeEventListener
 * @param media
 * @returns
 */
export function createMatchMediaMock(): MatchMediaMock2 {
  const listeners = new Map<ChangeEventListener, ListenerFn>();
  const emitter = new EventEmitter2({});
  let numCalls = 0;
  let currentQuery = '';

  function matchMedia(media: string): Partial<MediaQueryList> {
    return {
      get matches() {
        return media === currentQuery;
      },
      get media() {
        return media;
      },
      addEventListener(eventName: string, changeListener: ChangeEventListener) {
        if (eventName === CHANGE_EVENT) {
          const emitterListener = () => {
            numCalls++;
            const matches = media === currentQuery;
            changeListener({ matches, media } as MediaQueryListEvent);
          };
          listeners.set(changeListener, emitterListener);
          emitter.on(MEDIA_EVENT, emitterListener);
        }
      },
      removeEventListener(
        eventName: string,
        changeListener: ChangeEventListener,
      ) {
        if (eventName === CHANGE_EVENT) {
          const emitterListener = listeners.get(changeListener);
          if (emitterListener) {
            listeners.delete(changeListener);
            emitter.off(MEDIA_EVENT, emitterListener);
          }
        }
      },
    } as Partial<MediaQueryList>;
  }

  return {
    matchMedia,
    useMediaQuery(media: string): void {
      currentQuery = media;
      emitter.emit(MEDIA_EVENT);
    },
    cleanup() {
      listeners.clear();
      emitter.removeAllListeners();
    },
    get numListeners() {
      return listeners.size;
    },
    get numCalls() {
      return numCalls;
    },
  };
}

/**
 * Creates legacy mock with deprecated functions
 * - addListener
 * - removeListener
 * @returns
 */
export function createLegacyMediaMock(): MatchMediaMock2 {
  const listeners = new Map<ChangeEventListener, ListenerFn>();
  const emitter = new EventEmitter2({});
  let numCalls = 0;
  let currentQuery = '';

  /**
   * Create a partially working mock for matchMedia
   * @param media
   * @returns
   */
  function matchMedia(media: string): Partial<MediaQueryList> {
    return {
      get matches() {
        return media === currentQuery;
      },
      get media() {
        return media;
      },
      addListener(changeListener: ChangeEventListener) {
        const emitterListener = () => {
          numCalls++;
          const matches = media === currentQuery;
          changeListener({ matches, media } as MediaQueryListEvent);
        };
        listeners.set(changeListener, emitterListener);
        emitter.on(MEDIA_EVENT, emitterListener);
      },
      removeListener(changeListener: ChangeEventListener) {
        const emitterListener = listeners.get(changeListener);
        if (emitterListener) {
          listeners.delete(changeListener);
          emitter.off(MEDIA_EVENT, emitterListener);
        }
      },
    };
  }

  return {
    matchMedia,
    useMediaQuery(media: string): void {
      emitter.emit(MEDIA_EVENT);
      currentQuery = media;
    },
    cleanup() {
      emitter.removeAllListeners();
      listeners.clear();
    },
    get numListeners() {
      return listeners.size;
    },
    get numCalls() {
      return numCalls;
    },
  };
}

/**
 * Creates a mock with no listener functions
 * @returns
 */
export function createMediaMockWithoutApi(): MatchMediaMock2 {
  let query = '';

  /**
   * Create a partially working mock for matchMedia
   * @param media
   * @returns
   */
  function matchMedia(media: string): Partial<MediaQueryList> {
    return {
      get matches() {
        return media === query;
      },
      get media() {
        return media;
      },
    };
  }

  return {
    matchMedia,
    useMediaQuery(media: string): void {
      query = media;
    },
    cleanup() {
      // nothing to do
    },
    get numListeners() {
      return 0;
    },
    get numCalls() {
      return 0;
    },
  };
}

export function addMockToGlobal(
  matchMedia: MatchMediaMock2['matchMedia'],
): void {
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    value: matchMedia,
  });
}

export function removeMockFromGlobal(): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.matchMedia;
}
