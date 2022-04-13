var cacheName = 'phaser-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',


  '/scenes/wordsplayed.js',
  '/scenes/endGame.js',
  '/scenes/help.js',
  '/scenes/preload.js',
  '/scenes/selectGame.js',
  '/scenes/pauseGame.js',
  '/scenes/startGame.js',

  '/assets/particle.png',
  '/assets/particles.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/letter-1.png',
  '/assets/sprites/board-1.png',
  '/assets/sprites/icons.png',
  '/assets/sprites/load.png',
  '/assets/sprites/menu.png',
  '/assets/sprites/platform.png',
  '/assets/sprites/plain_star.png',
  '/assets/sprites/swap.png',

  '/classes/ScrabbleWordListAlt.js',
  '/classes/crossword.js',
  '/classes/settings.js',

  '/assets/fonts/clarendon.png',
  '/assets/fonts/lato.png',
  '/assets/fonts/clarendon.xml',
  '/assets/fonts/lato.xml',

  '/assets/sound/Inspiring-Acoustic-Guitar.mp3',



  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});