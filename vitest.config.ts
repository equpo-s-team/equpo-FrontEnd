import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    // Ambiente de test (simula DOM)
    environment: 'jsdom',
    
    // Configuración de cobertura
    coverage: {
      // Proveedor de cobertura (usa v8 que es más rápido)
      provider: 'v8',
      
      // Genera reportes en múltiples formatos
      reporter: [
        'text',           // Salida en consola
        'text-summary',   // Resumen en consola
        'html',           // Reporte HTML interactivo
        'lcov',           // Formato LCOV para SonarCloud
        'json'            // Formato JSON para análisis
      ],
      
      // Directorio donde se guardan los reportes
      reportsDirectory: 'coverage',
      
      // Incluir archivos del proyecto
      include: ['src/**/*.{ts,tsx}'],
      
      // Excluir archivos
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      
      // Umbrales mínimos de cobertura
      lines: 40,          // 40% líneas cubiertas (para FrontEnd)
      functions: 40,      // 40% funciones cubiertas
      branches: 40,       // 40% branches cubiertos
      statements: 40,     // 40% statements cubiertos
      
      // Fallar si no se alcanzan los umbrales
      perFile: false,
      
      // Verificar cobertura
      check: {
        lines: 40,
        functions: 40,
        branches: 30,     // Más flexible para branches
        statements: 40
      }
    },
    
    // Incluir archivos de test
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    
    // Configuración de globals
    globals: true,
    
    // Configuración de DOM
    environment: 'jsdom',
    
    // Setup files si es necesario
    setupFiles: [],
    
    // Configuración de reporters
    reporters: ['default']
  },
  
  // Resolver de módulos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
