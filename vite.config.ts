import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
const __dirname = path.resolve()

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
            name: "oaer",
            fileName: "oaer",
        }, //库编译模式配置
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ["vue"],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: "Vue",
                },
            },
        }, // rollup打包配置
    },
})
