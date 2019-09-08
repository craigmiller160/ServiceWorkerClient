
const readChannelPort = (port) => new Promise((resolve, reject) => {
    port.onmessage = (event) => {
        if (event.data.error) {
            reject(event.data.error);
            return;
        }
        resolve(event.data);
    };
});

self.addEventListener('install', (event) => {
    console.log('Installing ServiceWorker');
    event.waitUntil(self.skipWaiting());
});

const getToken = async (client) => {
    const channel = new MessageChannel();
    client.postMessage({
        type: 'GetToken'
    }, [channel.port1]);

    return await readChannelPort(channel.port2);
};

const addAuthHeader = async (event) => {
    const request = event.request;
    const client = await self.clients.get(event.clientId);
    if (!client) {
        return null;
    }

    const token = await getToken(client);
    const authHeader = `Bearer ${token}`;

    const body = await request.json();

    return fetch(new Request(request.url, {
        method: request.method,
        headers: {
            ...request.headers,
            authorization: authHeader
        },
        cache: request.cache,
        mode: 'cors', // we cannot use mode 'navigate', but can fall back to cors, which is good enough
        credentials: request.credentials,
        redirect: 'manual', // browser will handle redirect on its own
        body: JSON.stringify(body)
    }));
};

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api')) {
        return event.respondWith(addAuthHeader(event));
    }
});
