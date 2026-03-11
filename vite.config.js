import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        lider: 'lider.html',
        'reset-senha': 'reset-senha.html'
      }
    }
  },
  server: {
    port: 5500,
    open: true
  }
});
