import { defineConfig } from 'vite';
import VitePluginLinaria from 'vite-plugin-linaria';

import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), VitePluginLinaria()],
});
