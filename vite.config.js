// lycuscoder/aduan-publik-responta/Aduan-Publik-RESPONTA-9ae53454fe2c9159bed99f8516c1dd81ca39fbf7/vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react({
            include: 'resources/js/**/*.{jsx,tsx}', 
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});