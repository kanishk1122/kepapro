import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    react(),
    reactRefresh()
  ],
  server: {
    host: '0.0.0.0', // Bind to all available network interfaces
    port: 3000, // Choose your desired port
  },
});
