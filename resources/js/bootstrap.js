/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from "axios";
import { Notyf } from "notyf";
window.axios = axios;

window.notyf = new Notyf({
    duration: 1000,
    position: {
        x: "right",
        y: "top",
    },
    types: [
        {
            type: "warning",
            background: "orange",
            icon: {
                className: "material-icons",
                tagName: "i",
                text: "warning",
            },
        },
        {
            type: "error",
            background: "indianred",
            duration: 2000,
            dismissible: true,
        },
        {
            type: "success",
            background: "#3DC763",
            duration: 2000,
            dismissible: true,
        },
    ],
});

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = new Pusher("a41649538081bc522756", {
    cluster: "ap1",
    wsHost: "ws-ap1.pusher.com",
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
    disableStats: true,
    encrypted: true,
});

// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "mt1",
//     wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? "https") === "https" ? true : false,
//     enabledTransports: ["ws", "wss"],
//     disableStats: true,
//     encrypted: true,
// });

// window.Echo = new Echo({
//     broadcaster: "pusher",
//     key: "a41649538081bc522756",
//     cluster: "ap1",
//     wsHost: "ws-ap1.pusher.com",
//     wsPort: 443,
//     wssPort: 443,
//     forceTLS: true,
//     enabledTransports: ["ws", "wss"],
//     disableStats: true,
//     encrypted: true,
// });
