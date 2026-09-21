"use strict";

const CACHE_NAME="leng-hai-static-v2";
const ASSETS=[
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./assets/qr-generator.js",
  "./manifest.webmanifest",
  "./assets/waterfront.webp",
  "./assets/energy.webp",
  "./assets/port.webp",
  "./assets/governance.webp",
  "./assets/campus.webp",
  "./assets/entity-project-waste-to-energy.webp",
  "./assets/entity-event-port-power-peak.webp",
  "./assets/entity-role-energy-water-engineer.webp",
  "./assets/entity-paradox-oil-dividend.webp",
  "./assets/app-icon.svg",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/leng-hai-offline.html"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();
    if(new URL(event.request.url).origin===self.location.origin) caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>event.request.mode==="navigate"?caches.match("./index.html"):Response.error())));
});
