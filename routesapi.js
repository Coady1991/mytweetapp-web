const UsersApi = require('./app/api/usersapi');
const TweetApi = require('./app/api/tweetsapi');

module.exports = [
  { method: 'GET', path: '/api/users', config: UsersApi.find },
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
  { method: 'POST', path: '/api/users/{id}/follow', config: UsersApi.follow },
  { method: 'POST', path: '/api/users/{id}/unfollow', config: UsersApi.unfollow },
  { method: 'GET', path: '/api/users/{id}/followingTimeline', config: UsersApi.followingTimeline },

  { method: 'GET', path: '/api/tweets', config: TweetApi.find },
  { method: 'GET', path: '/api/tweets/{id}', config: TweetApi.findOne },
  { method: 'POST', path: '/api/tweets', config: TweetApi.create },
  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetApi.deleteAll },

];
