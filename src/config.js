// const url = 'http://localhost:3003/';
const url = 'https://apitest.elma.online/';

const s3SubFolder = 'test/';

module.exports = {
  url,
  port: 3000,
  s3SubFolder,
  dlUrl: `${url}dl/`,
  api: `${url}api/`,
  up: `${url}u/`,
  maps: 'AIzaSyDE8Prt4OybzNNxo1MzIn1XYNGxm9rI8Zk',
  recaptcha: '6Le-n9QUAAAAAG-3bYyysXddxwD6I6iJeDBTHf2r',
  maxUploadSize: 10485760,
  s3Url: `https://space.elma.online/${s3SubFolder}`,
};
