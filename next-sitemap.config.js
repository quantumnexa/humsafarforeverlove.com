/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://humsafarforeverlove.com',
  generateRobotsTxt: true, // (optional)
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/dashboard/*',
    '/auth',
    '/profile/create',
    '/profile/edit',
    '/packages/payment/*',
    '/verified-badge-payment'
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/profiles'),
    await config.transform(config, '/success-stories'),
    await config.transform(config, '/packages'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/faqs'),
    await config.transform(config, '/how-to-use'),
    await config.transform(config, '/match-guarantee'),
    await config.transform(config, '/privacy-policy'),
    await config.transform(config, '/terms-conditions')
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/auth',
          '/profile/create',
          '/profile/edit',
          '/packages/payment/',
          '/verified-badge-payment',
          '/_next/',
          '/api/'
        ]
      }
    ],
    additionalSitemaps: [
      'https://humsafarforeverlove.com/sitemap.xml'
    ]
  },
  transform: async (config, path) => {
    // Custom priority based on page importance
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/profiles') || path.includes('/success-stories')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.includes('/packages') || path.includes('/about')) {
      priority = 0.8;
      changefreq = 'weekly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  }
};