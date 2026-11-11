const CACHE='rep-rhythm-e5e9dad90b';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(r,{ignoreSearch:true});
    const net=fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(res=>{if(res.ok)cache.put(r,res.clone());return res});
    if(!cached)return net;
    /* Use the network when it is quick, and the saved copy when the gym signal is bad */
    return Promise.race([net.catch(()=>cached),new Promise(ok=>setTimeout(()=>ok(cached),2000))]);
  })());
});
