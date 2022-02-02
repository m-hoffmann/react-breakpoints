export type MediaQueryCallback = (
  event: Pick<MediaQueryListEvent, 'matches' | 'media'>,
) => void;

export class MediaQueryListener {
  constructor(
    private readonly mediaQueryList: MediaQueryList,
    private readonly callback: MediaQueryCallback,
  ) {
    // bind the event handler
    this.eventListener = this.eventListener.bind(this);
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
        mediaQueryList.removeEventListener('change', this.eventListener);
      } else if (typeof mediaQueryList.removeListener === 'function') {
        mediaQueryList.removeListener(this.eventListener);
      }
    }
  }

  /**
   * Called in constructor
   */
  private attach() {
    const mediaQueryList = this.mediaQueryList;
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', this.eventListener);
    } else if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(this.eventListener);
    }
  }

  /**
   * Listener for
   * - EventTarget API
   * - legacy API
   * @param ev
   */
  private eventListener(ev: MediaQueryListEvent) {
    this.callback(ev);
  }
}
