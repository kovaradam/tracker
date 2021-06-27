import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import VitePluginLinaria from 'vite-plugin-linaria';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), VitePluginLinaria()],
});
