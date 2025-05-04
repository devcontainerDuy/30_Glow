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

window.pusher = new Pusher("a41649538081bc522756", {
    cluster: "ap1",
    forceTLS: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    encrypted: true,
    wsHost: "ws-ap1.pusher.com",
    wsPort: 443,
    wssPort: 443,
    authEndpoint: "/broadcasting/auth",
    auth: {
        headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
    },
});

window.Echo = new Echo({
    broadcaster: "pusher",
    key: "a41649538081bc522756",
    cluster: "ap1",
    forceTLS: true,
    wsHost: "ws-ap1.pusher.com",
    wsPort: 443,
    wssPort: 443,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    encrypted: true,
});
