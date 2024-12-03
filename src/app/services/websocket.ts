import Echo from 'laravel-echo';
 
import Pusher from 'pusher-js';

//@ts-expect-error xdxd
window.Pusher = Pusher;

//@ts-expect-error xdxd
window.Echo = new Echo({
    broadcaster: 'reverb',
    key: '8aufgskfspp0pybzycgg',
    wsHost: 'localhost',
    wsPort: '8080',
    wssPort: '8080',
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

//@ts-expect-error xdxd
const ws = window.Echo;

export default ws;