// Registro de IA / PWA: Service Worker para Mueblería Santillán

const VERSION = "v2";
const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icono-192.png",
    "./icono-512.png"
];

// 1. EVENTO INSTALL: Guarda todos los archivos en la caché la primera vez
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(VERSION).then((cache) => {
            console.log("Service Worker: Guardando archivos esenciales en caché...");
            return cache.addAll(ARCHIVOS);
        })
    );
});

// 2. EVENTO ACTIVATE: Limpia y borra las cachés de versiones anteriores
self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((clavesCaches) => {
            return Promise.all(
                clavesCaches.map((clave) => {
                    if (clave !== VERSION) {
                        console.log("Service Worker: Borrando caché vieja:", clave);
                        return caches.delete(clave);
                    }
                })
            );
        })
    );
});

// 3. EVENTO FETCH: Estrategia "Primero la caché" (responde con la copia guardada o va a la red)
self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuestaEnCache) => {
            return respuestaEnCache || fetch(evento.request);
        })
    );
});