export type MediaQueryCallback = (
  event: Pick<MediaQueryListEvent, 'matches' | 'media'>,
) => void;

export class MediaQueryListener {
  constructor(
    private readonly mediaQueryList: MediaQueryList,
    private readonly callback: MediaQueryCallback,
  ) {
    // bind the event handlers
    this.eventTargetListener = this.eventTargetListener.bind(this);
    this.legacyListener = this.legacyListener.bind(this);
    // attach the listeners
    this.attach();
  }

  /**
   * Removes the listeners
   */
  public detach() {
    const mediaQueryList = this.mediaQueryList;
    if (mediaQueryList != null) {
      if (typeof mediaQueryList.removeEventListener === 'function') {
        mediaQueryList.removeEventListener('change', this.eventTargetListener);
      } else if (typeof mediaQueryList.removeListener === 'function') {
        mediaQueryList.removeListener(this.legacyListener);
      }
    }
  }

  /**
   * Called in constructor
   */
  private attach() {
    const mediaQueryList = this.mediaQueryList;
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', this.eventTargetListener);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(this.legacyListener);
    }
  }

  /**
   * Listener for EventTarget API
   * @param ev
   */
  private eventTargetListener(ev: MediaQueryListEvent) {
    this.callback(ev);
  }

  /**
   * Listener for deprecated legacy API
   */
  private legacyListener() {
    this.callback(this.mediaQueryList);
  }
}
