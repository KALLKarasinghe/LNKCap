import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Allow accessing from mobile device on local Wi-Fi
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
