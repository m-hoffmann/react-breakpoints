import { EventEmitter, EmitterListener } from './EventEmitter';

/**
 * The mock
 */
export interface MatchMediaMock2 {
  /**
   * Returns a mocked media query list
   * @param media
   */
  matchMedia(media: string): MediaQueryList;
  /**
   * Allows to get the query
   *
   * Event listeners are called when their mediaQuery
   * matches this one equality(equality)
   */
  mediaQuery: string;
  /**
   * Removes event listeners
   */
  cleanup(): void;
  /**
   * Number of active event listeners
   */
  numListeners: number;
  /**
   * Number of calls to event listeners
   */
  numCalls: number;
}

const CHANGE_EVENT = 'change';

/**
 * Options for creating the mock
 */
interface MatchMediaMockOptions {
  /**
   * Has deprecated API
   * @default true
   */
  eventTargetApi?: boolean;
  /**
   * Has EventTarget API
   * @default true
   */
  legacyApi?: boolean;
}

/**
 * Create a partially working mock for matchMedia
 * with EventTarget functions
 * - addEventListener
 * - removeEventListener
 * @param media
 * @returns
 */
export function createMediaQueryListMock(
  options?: MatchMediaMockOptions,
): MatchMediaMock2 {
  const listeners = new Map<EventListener, EmitterListener>();

  const emitter = new EventEmitter();
  let numCalls = 0;
  let currentQuery = 'all';

  const { eventTargetApi = true, legacyApi = true } = options ?? {};
  function matchMedia(media: string): MediaQueryList {
    const mediaQueryList: MediaQueryList = {
      get matches() {
        return media === currentQuery;
      },
      get media() {
        return media;
      },
    } as MediaQueryList;

    function createListener(listener: EventListener): EmitterListener {
      return () => {
        numCalls++;
        const matches = mediaQueryList.matches;
        listener({ matches, media } as MediaQueryListEvent);
      };
    }

    function addListener(listener: EventListener) {
      const emitterListener = createListener(listener);
      listeners.set(listener, emitterListener);
      emitter.on(CHANGE_EVENT, emitterListener);
    }

    function removeListener(listener: EventListener) {
      const emitterListener = listeners.get(listener);
      if (emitterListener) {
        listeners.delete(listener);
        emitter.off(CHANGE_EVENT, emitterListener);
      }
    }

    function addEventListener(event: string, listener: EventListener) {
      if (event === CHANGE_EVENT) {
        addListener(listener);
      }
    }

    function removeEventListener(event: string, listener: EventListener) {
      if (event === CHANGE_EVENT) {
        removeListener(listener);
      }
    }

    function dispatchEvent(): boolean {
      return false;
    }

    if (eventTargetApi) {
      mediaQueryList.addEventListener = addEventListener;
      mediaQueryList.removeEventListener = removeEventListener;
      mediaQueryList.dispatchEvent = dispatchEvent;
      mediaQueryList.onchange = null;
    }

    if (legacyApi) {
      mediaQueryList.addListener = addListener;
      mediaQueryList.removeListener = removeListener;
    }

    // listener that is responsible for onchange
    emitter.on(CHANGE_EVENT, () => {
      if (typeof mediaQueryList.onchange === 'function') {
        numCalls++;
        const matches = mediaQueryList.matches;
        mediaQueryList.onchange({ matches, media } as MediaQueryListEvent);
      }
    });

    return mediaQueryList;
  }

  return {
    matchMedia,
    cleanup() {
      emitter.clear();
    },
    get mediaQuery(): string {
      return currentQuery;
    },
    set mediaQuery(media: string) {
      if (currentQuery !== media) {
        currentQuery = media;
        emitter.emit(CHANGE_EVENT);
      }
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
 * Creates mock
 *
 * with event target functions
 * - addEventListener
 * - removeEventListener
 * - dispatchEvent
 * - onchange
 *
 * without the deprecated functions
 * - addListener
 * - removeListener
 * @returns The mock object
 */
export function createMatchMediaMock(): MatchMediaMock2 {
  return createMediaQueryListMock({ eventTargetApi: true, legacyApi: false });
}

/**
 * Creates legacy mock with deprecated functions
 * - addListener
 * - removeListener
 * @returns The mock object
 */
export function createLegacyMediaMock(): MatchMediaMock2 {
  return createMediaQueryListMock({ eventTargetApi: false, legacyApi: true });
}

/**
 * Creates a mock with no listener functions
 * @returns The mock object
 */
export function createMediaMockWithoutApi(): MatchMediaMock2 {
  return createMediaQueryListMock({ eventTargetApi: false, legacyApi: false });
}

export function addMockToGlobal(
  matchMedia: MatchMediaMock2['matchMedia'],
): void {
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  });
}

export function removeMockFromGlobal(): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.matchMedia;
}
