/* 毛孩聲音收藏館 · offline support
   網頁本體：有網路時先抓最新版（離線才用暫存），所以更新會立刻生效。
   字型與圖示：先用暫存，背景再更新。你的錄音不經過這裡，一直只存在裝置的資料庫。 */
const VER='psa-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./favicon.png','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VER).then(c=>c.put('./index.html',cp))}return res}).catch(()=>caches.match('./index.html').then(m=>m||caches.match('./'))));return}
  const same=u.origin===location.origin,font=/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(VER).then(c=>c.put(r,cp))}return res}).catch(()=>m);return m||net}));
});
