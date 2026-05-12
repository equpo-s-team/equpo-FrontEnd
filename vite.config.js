import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('emoji-mart') || id.includes('@emoji-mart')) return 'emoji';
          if (id.includes('socket.io-client') || id.includes('engine.io')) return 'socketio';
        },
      },
    },
  },
  server: {
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  resolve: {
    dedupe: ['three'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
