
const loadTxtBtn = document.querySelector('#load-text-btn');
const serverTxt = document.querySelector('#server-text');

loadTxtBtn.onclick = () => {
    axios.get('http://localhost:3000/api/hello', {
        headers: {
            // authorization: 'Hello There'
        },
        withCredentials: true
    })
        .then((res) => {
            serverTxt.textContent = res.data;
        })
        .catch((error) => {
            console.log(error);
            alert('Error with loading text');
        });
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log(`ServiceWorker registered`, registration);
            }, (error) => {
                console.log('ServiceWorker registration failed', error);
            });
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message', event);
        event.ports[0].postMessage('Message Response');
    });
}
