import { mkdir, writeFile } from 'node:fs/promises';

const siteUrl = process.env.VITE_SITE_URL || 'https://bdshop.com';
const routes = [
  '/',
  '/products',
  '/about',
  '/help',
  '/returns',
  '/privacy-policy',
  '/terms',
  '/cookie-policy',
];

await mkdir('dist', { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === '/' || route === '/products' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

await writeFile('dist/sitemap.xml', sitemap);
await writeFile('dist/robots.txt', robots);

