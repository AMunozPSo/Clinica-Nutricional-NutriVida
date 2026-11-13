import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/api/v1/(auth|usuarios|profesionales)': 'http://50.17.200.0:8081',
      '^/api/v1/(servicios|categorias)': 'http://50.17.200.0:8082',
      '^/api/v1/(citas|pacientes|planes|progreso|contacto)': 'http://50.17.200.0:8083',
      '^/api/v1/pedidos': 'http://50.17.200.0:8084',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    exclude: ['**/node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/main.jsx', 'src/setupTests.js'],
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      reportsDirectory: 'coverage/vitest',
    },
  },
})
