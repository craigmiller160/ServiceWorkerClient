
// TODO need to make sure the changes here load immediately before anything on the page does

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
    console.log('Installing ServiceWorker', self.clients);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('active', (event) => {
    event.waitUntil(self.clients.claim());
    console.log('Activating ServiceWorker', self.clients);
});

const getResponse = async (event) => {

    const request = event.request;
    const client = await self.clients.get(event.clientId);
    console.log('Client', client);

    if (!client) {
        return null;
    }

    const channel = new MessageChannel();

    client.postMessage('Hello Message', [channel.port1]);
    let authHeader;
    try {
        const response = await readChannelPort(channel.port2);
        authHeader = response;
        console.log('Response', response);
    } catch (ex) {
        console.log('Error with response', ex);
    }

    // return fetch(new Request({
    //     url: 'https://www.google.com',
    //     method: 'get'
    // }));
    // return fetch(request);
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
    }));
};

self.addEventListener('fetch', (event) => {
    console.log('Fetching', event.clientId);
    console.log('Request', event.request.url);

    if (event.request.url.includes('/api')) {
        event.respondWith(getResponse(event));
    }
});
