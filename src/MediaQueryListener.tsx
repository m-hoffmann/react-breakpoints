export type MediaQueryCallback = (
  event: Pick<MediaQueryListEvent, 'matches' | 'media'>,
) => void;

export interface MediaQueryListener {
  /**
   * Removes the listeners
   */
  detach(): void;
}

/**
 * Creates an event listener
 * @param mediaQueryList
 * @param callback
 * @returns
 */
export function createMediaQueryListener(
  mediaQueryList: MediaQueryList,
  callback: MediaQueryCallback,
): MediaQueryListener {
  /** Listener for EventTarget API and  legacy API */
  function eventListener(ev: MediaQueryListEvent) {
    callback(ev);
  }

  /** Attaches the event listener */
  function attach() {
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', eventListener);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(eventListener);
    }
  }

  /** Removes the event listener */
  function detach() {
    if (typeof mediaQueryList.removeEventListener === 'function') {
      mediaQueryList.removeEventListener('change', eventListener);
    } else if (typeof mediaQueryList.removeListener === 'function') {
      mediaQueryList.removeListener(eventListener);
    }
  }

  attach();

  return {
    detach,
  };
}
