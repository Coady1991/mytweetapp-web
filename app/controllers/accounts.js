'use strict'

exports.main = {
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },
};

exports.signup = {
  handler: function (request, reply) {
    reply.view('signup', { title: 'Signup for MyTweets' });
  },
};

exports.login = {
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });
  },
};

exports.authenticate = {
  handler: function (request, reply) {
    reply.redirect('/home');
  },
};

exports.logout = {
  handler: function (request, reply) {
    reply.redirect('/');
  },
};
