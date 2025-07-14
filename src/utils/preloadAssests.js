// utils/preloadAssets.js

export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        })
    )
  );
};

export const preloadSVGs = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          fetch(url)
            .then((res) => (res.ok ? res.text() : Promise.reject()))
            .then(() => resolve())
            .catch(reject);
        })
    )
  );
};
