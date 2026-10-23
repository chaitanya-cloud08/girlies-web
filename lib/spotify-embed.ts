// Spotify's official IFrame API — loaded once, shared by every persona slide.
// Using the controller's .play() (instead of a raw `?autoplay=1` URL) is what
// actually completes Spotify's playback/DRM handshake so audio plays.
type SpotifyIFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
};

export type SpotifyEmbedController = {
  play: () => void;
  pause: () => void;
  destroy?: () => void;
  addListener: (event: string, cb: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
    __spotifyIframeApi?: SpotifyIFrameAPI;
  }
}

let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

export function loadSpotifyIframeApi(): Promise<SpotifyIFrameAPI> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      resolve(api);
    };
    if (!document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }
  });
  return apiPromise;
}
