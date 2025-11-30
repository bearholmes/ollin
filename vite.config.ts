import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const isBookmarklet = mode === 'bookmarklet';

  const rollupInput: Record<string, string> = isBookmarklet
    ? {
        ollin: resolve(__dirname, 'bookmarklet/bookmarklet-entry.ts')
      }
    : {
        'background/background': resolve(__dirname, 'app/background/background.ts'),
        'content/content-script': resolve(__dirname, 'app/content/content-script.ts'),
        'options/options': resolve(__dirname, 'app/options/options.ts'),
        'shared/i18n': resolve(__dirname, 'app/shared/i18n.ts')
      };

  return {
    build: {
      target: isBookmarklet ? 'es2015' : 'es2020',
      outDir: isBookmarklet ? 'dist/bookmarklet' : 'dist/chrome',
      emptyOutDir: false,
      minify: false,
      sourcemap: true,
      rollupOptions: {
        input: rollupInput,
        output: {
          entryFileNames: isBookmarklet ? 'ollin.js' : '[name].js',
          format: 'es'
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './shared')
      }
    }
  };
});
