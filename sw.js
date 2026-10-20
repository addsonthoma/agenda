/* Service worker: abre a agenda mesmo sem internet (os dados ficam no aparelho e sincronizam depois). */
const VERSAO = 'agenda-20261020141136';
const ARQUIVOS = ['./', 'index.html', 'estilo.css', 'datas.js', 'ponte.js', 'app.js', 'config-nuvem.js',
  'icone.png', 'icone-192.png', 'icone-512.png', 'manifest.webmanifest'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// arquivos do app: rede primeiro (pega atualizações), cache se estiver sem internet; Supabase nunca passa por aqui
self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== location.origin) return;
  ev.respondWith(
    fetch(ev.request)
      .then(r => { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(ev.request, copia)); return r; })
      .catch(() => caches.match(ev.request).then(r => r || caches.match('index.html')))
  );
});
