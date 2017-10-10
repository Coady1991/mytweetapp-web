const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');

module.exports = [
  { method: 'GET', path: '/', config: Tweets.home },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
