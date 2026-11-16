import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { google } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx' ,'resources/css/filament/admin/theme.css'],
            refresh: true,
            fonts: [
                // Display face: heavy geometric poster type drawn for Arabic
                // and Latin together, so a bilingual heading reads as one voice.
                google('Alexandria', {
                    weights: [600, 700, 800, 900],
                }),
                // Body face: IBM Plex Sans Arabic keeps long Arabic dish names
                // and descriptions open and legible at small sizes.
                google('IBM Plex Sans Arabic', {
                    weights: [400, 500, 600, 700],
                }),
            ],
        }),
        inertia({ ssr: false }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
    ],
});
