
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
    console.log('Activating ServiceWorker', self.clients);
});

self.addEventListener('fetch', async (event) => {
    console.log('Fetching', event.clientId);
    const res = await self.clients.get(event.clientId);
    console.log('EventClient', res);
    const res2 = await self.clients.matchAll({
        includeUncontrolled: true
    });
    console.log('MatchedClients', res2);

    const channel = new MessageChannel();

    res.postMessage('Hello Message', [channel.port1]);
    let authHeader;
    try {
        const response = await readChannelPort(channel.port2);
        authHeader = response;
        console.log('Response', response);
    } catch (ex) {
        console.log('Error with response', ex);
    }

    console.log('Request', event.request);
    return fetch({
        ...event.request,
        headers: {
            ...event.request.headers,
            authorization: authHeader
        }
    });
});
