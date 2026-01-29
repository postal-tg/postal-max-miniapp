interface WebAppLike {
  initData: string;
}

declare global {
  interface Window {
    WebApp?: WebAppLike;
  }
}

export {};
