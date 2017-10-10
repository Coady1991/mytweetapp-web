'use strict'

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to MyTweet' });
  },
};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Signup for MyTweets' });
  },
};

exports.login = {
  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to MyTweet' });
  },
};

exports.register = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/login');
  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    if ((user.email in this.users) && (user.password === this.users[user.email].password)) {
      request.cookieAuth.set({
        loggedIn: true,
        loggedInUser: user.email,
      });
      reply.redirect('/home');
    } else {
      reply.redirect('/login');
    }
  },
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.viewSettings = {
  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    var currentUserDetails = this.users[userEmail];
    reply.view('settings', { title: 'Edit Account Settings', user: currentUserDetails });
  },
};

exports.updateSettings = {
  handler: function (request, reply) {
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/settings');
  },
};
