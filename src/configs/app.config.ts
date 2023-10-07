export default () => ({
  port: parseInt(process.env.PORT) || 8080,
  theorgBearer: process.env.THEORG_BEARER || '',
});
