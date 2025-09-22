import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // Configuração otimizada para produção
  build: {
    outDir: "dist", // Vercel espera 'dist' por padrão
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar bibliotecas grandes em chunks próprios
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react']
        }
      }
    },
    // Otimizações para produção
    minify: 'terser',
    sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
    target: 'es2015' // Compatibilidade com navegadores mais antigos
  },
  plugins: [
    tsconfigPaths(), 
    react(), 
    tagger()
  ],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  },
  // Configurações para preview (produção local)
  preview: {
    port: 4173,
    host: true
  },
  // Otimizações de dependências
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js']
  }
});