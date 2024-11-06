import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx", "resources/css/app.css"],
            refresh: true,
        }),
        react(),
    ],

    build: {
        minify: false,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: "/resources/js/app.jsx",
                bootstrap: "/resources/js/bootstrap.js",
            },
        },
    },

    define: {
        "import.meta.env.VITE_PUSHER_APP_KEY": JSON.stringify(process.env.PUSHER_APP_KEY),
        "import.meta.env.VITE_PUSHER_APP_CLUSTER": JSON.stringify(process.env.PUSHER_APP_CLUSTER),
    },

    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },

    server: {
        hmr: {
            host: "localhost",
            port: 8080,
            protocol: "ws",

            hmrOptions: {
                host: "localhost",
                port: 8080,
                protocol: "ws",
            },
        },
    },

    ssr: {
        noExternal: ["@inertiajs/server"],
    },
});
