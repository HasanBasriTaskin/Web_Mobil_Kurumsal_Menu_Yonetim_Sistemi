const SITE = 'https://corporatemenusystem.taskinnovation.net';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/user', '/reset-password', '/api/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
