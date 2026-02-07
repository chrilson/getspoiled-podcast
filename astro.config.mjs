import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'always'
  },
  experimental: {
    clientPrerender: true
    // Fonts temporarily disabled to fix loading error
    // fonts: [
    //   {
    //     provider: fontProviders.google({
    //       experimental: { variableAxis: { Inter: { opsz: ['14..32'] } } }
    //     }),
    //     name: 'Inter',
    //     cssVariable: '--astro-font-inter',
    //     weights: ['300 900'],
    //     styles: ['normal'],
    //     subsets: ['latin']
    //   }
    // ]
  },
  image: {
    service: passthroughImageService()
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  site: 'https://getspoiled.club',
  trailingSlash: 'never',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        // Exclude episode number pages and only include slug pages.
        return !/^\/\d+\/?$/.test(pathname);
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
