import { EventEmitter2 } from 'eventemitter2';

export interface MatchMediaMock2 {
  matchMedia(media: string): Partial<MediaQueryList>;
  updateQuery(query: string): void;
  cleanup(): void;
}

export function createMatchMediaMock(): MatchMediaMock2 {
  const emitter = new EventEmitter2({});

  function matchMedia(media: string): Partial<MediaQueryList> {
    function addEventListener(eventName: string, fn: (q: unknown) => void) {
      emitter.on('media', (queryHack: string) => {
        // console.log({ media, eventName, queryHack });
        const matches = media === queryHack;
        fn({ matches, media });
      });
    }
    function removeEventListener() {
      emitter.removeListener('media', addEventListener);
    }

    return {
      matches: false,
      media,
      addEventListener,
      removeEventListener,
    };
  }

  function updateQuery(media: string): void {
    emitter.emit('media', media);
  }

  function cleanup() {
    emitter.removeAllListeners();
  }

  return { matchMedia, updateQuery, cleanup };
}
