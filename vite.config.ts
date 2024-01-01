import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// generate *.d.ts
import dts from 'vite-plugin-dts'
// add import css in js file after build
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import path from "path"
const __dirname = path.resolve()
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), libInjectCss(), dts()
  ],
  resolve: {
    dedupe: ['vue'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '127.0.0.1',
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4001/',
        changeOrigin: true,
        ws: true,
      },
      '/file': {
        target: 'http://127.0.0.1:4001/',
        changeOrigin: true,
        ws: true,
      },
      '/media': {
        target: 'http://127.0.0.1:4001/',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"), //指定组件编译入口文件
      formats: ['es'],
      name: "oaer",
      fileName: "oaer",
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    }, // rollup打包配置
  },
})
