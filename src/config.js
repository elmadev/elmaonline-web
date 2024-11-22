const url =
  import.meta.env.MODE === 'test'
    ? 'https://apitest.elma.online/'
    : 'http://localhost:3003/';

const s3SubFolder = 'test/';

const config = {
  url,
  port: 3000,
  s3SubFolder,
  dlUrl: `${url}dl/`,
  api: `${url}api/`,
  up: `https://apitest.elma.online/u/`,
  maps: 'AIzaSyDE8Prt4OybzNNxo1MzIn1XYNGxm9rI8Zk',
  recaptcha: '6Le-n9QUAAAAAG-3bYyysXddxwD6I6iJeDBTHf2r',
  maxUploadSize: 10485760,
  s3Url: `https://space.elma.online/${s3SubFolder}`,
  hotJarId: 0,
  routerDevTools: false,
  queryDevTools: false,
};

export default config;
