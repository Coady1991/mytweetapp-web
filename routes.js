const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Accounts = require('./app/controllers/accounts');
const Admins = require('./app/controllers/admins');

module.exports = [
  { method: 'GET', path: '/home', config: Tweets.home },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'POST', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/usertimeline', config: Tweets.usertimeline },
  { method: 'GET', path: '/deletetweet/{id}', config: Tweets.deletetweet },
  { method: 'GET', path: '/deletealltweets', config: Tweets.deletealltweets },
  { method: 'GET', path: '/getPicture/{id}', config: Tweets.getPicture },

  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  { method: 'POST', path: '/profilePicture', config: Accounts.profilePicture },
  { method: 'GET', path: '/getProfilePicture/{id}', config: Accounts.getProfilePicture },

  { method: 'GET', path: '/adminhome', config: Admins.adminhome },
  { method: 'GET', path: '/adminadduser', config: Admins.adminadduser },
  { method: 'POST', path: '/adminnewuser', config: Admins.adminnewuser },
  { method: 'GET', path: '/admindeleteuser/{id}', config: Admins.admindeleteuser },
  { method: 'GET', path: '/adminviewuser/{id}', config: Admins.adminviewuser },
  { method: 'GET', path: '/admindeletetweet/{id}', config: Admins.admindeletetweet },
  { method: 'GET', path: '/admindeletealltweets/{id}', config: Admins.admindeletealltweets },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
