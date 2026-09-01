var CACHE='mhoro-v3';
var URLS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
 e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
 self.skipWaiting();});
self.addEventListener('activate',function(e){
 e.waitUntil(caches.keys().then(function(ns){
  return Promise.all(ns.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));
 }).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(function(r){var copy=r.clone();
   caches.open(CACHE).then(function(c){c.put('./index.html',copy);});return r;})
   .catch(function(){return caches.match('./index.html');}));
  return;}
 e.respondWith(caches.match(e.request).then(function(r){
  return r||fetch(e.request).then(function(resp){var copy=resp.clone();
   caches.open(CACHE).then(function(c){c.put(e.request,copy);});return resp;});}));});