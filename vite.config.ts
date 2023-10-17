import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const folders = fs.readdirSync('./src', { withFileTypes: true });
const alias = folders
  .filter((dirent) => dirent.isDirectory())
  .reduce(
    (res, dir) => {
      res[dir.name] = `/src/${dir.name}`;
      return res;
    },
    {},
  );

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react(), svgr()],
  resolve: {
    alias: {
      ...alias,
      web3_modules: 'web3',
    },
  },
})
