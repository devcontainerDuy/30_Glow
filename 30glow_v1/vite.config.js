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

    define: {
        "import.meta.env.VITE_PUSHER_APP_KEY": JSON.stringify(process.env.PUSHER_APP_KEY),
        "import.meta.env.VITE_PUSHER_APP_CLUSTER": JSON.stringify(process.env.PUSHER_APP_CLUSTER),
    },

    resolve: {
        alias: {
            "@": "/resources/js",
            "@components": "/resources/js/Components",
            "@containers": "/resources/js/Containers",
            "@hooks": "/resources/js/Hooks",
            "@pages": "/resources/js/Pages",
            "@layouts": "/resources/js/Layouts",
            "@css": "/resources/css",
            "@img": "/resources/img",
        },
    },

    server: {
        cors: true,
        hmr: {
            host: "localhost",
        },
        mimeTypes: {
            "text/css": ["css"],
            "text/html": ["html"],
            "text/javascript": ["js"],
            "application/javascript": ["js"],
            "application/json": ["json"],
            "application/xml": ["xml"],
            "image/svg+xml": ["svg"],
            "image/png": ["png"],
            "image/jpeg": ["jpg", "jpeg"],
            "image/gif": ["gif"],
            "image/webp": ["webp"],
            "image/bmp": ["bmp"],
            "image/tiff": ["tiff"],
            "image/x-icon": ["ico"],
        },
    },

    ssr: {
        noExternal: ["@inertiajs/server"],
    },
});
