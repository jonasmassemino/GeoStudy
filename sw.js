/* GéoQuiz — service worker : la carte reste jouable hors ligne */
const CACHE='geoquiz-v1';
const SHELL=['/','/index.html','/map.json','/manifest.webmanifest','/icon-192.png','/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin) return;

  /* le fond de carte ne change jamais : cache d'abord */
  if(req.url.endsWith('/map.json')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res;
    })));
    return;
  }
  /* le reste : réseau d'abord, cache en secours (donc toujours la dernière version en ligne) */
  e.respondWith(
    fetch(req).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res;
    }).catch(()=>caches.match(req).then(hit=>hit||caches.match('/index.html')))
  );
});
