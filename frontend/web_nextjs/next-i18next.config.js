module.exports = {
  // Disable i18n routing to prevent 404 with /en/ prefix
  // i18n: {
  //   defaultLocale: 'vi',
  //   locales: ['vi', 'en'],
  //   localeDetection: false,
  // },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
