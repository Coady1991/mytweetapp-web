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

exports.register = {
  handler: function (request, reply) {
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/login');
  },
};

exports.authenticate = {
  handler: function (request, reply) {
    const user = request.payload;
    if ((user.email in this.users) && (user.password === this.users[user.email].password)) {
      this.currentUser = this.users[user.email];
      reply.redirect('/home');
    } else {
      reply.redirect('/signup');
    }
  },
};

exports.logout = {
  handler: function (request, reply) {
    const user = request.payload;
    reply.redirect('/');
  },
};
