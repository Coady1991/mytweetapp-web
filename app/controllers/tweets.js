'use strict';

exports.home = {
  handler: (request, reply) => {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },
};

exports.signup = {
  handler: (request, reply) => {
    reply.view('signup', { title: 'Signup for MyTweet' });
  },
};

exports.login = {
  handler: (request, reply) => {
    reply.view('login', { title: 'Login to MyTweet' });
  },
};
