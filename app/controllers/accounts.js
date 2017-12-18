'use strict'

const User = require('../models/user');
const Joi = require('joi');

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

  validate: {

    options: {
      abortEarly: false,
    },

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.authenticate = {
  auth: false,

  validate: {

    options: {
      abortEarly: false,
    },

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign in error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    const user = request.payload;
    if (user.email == 'admin@mytweet.com' && user.password == 'admin') {
      request.cookieAuth.set({
        loggedIn: true,
        loggedInAdmin: user.email,
      });
      reply.redirect('/adminhome');
    } else {
      User.findOne({ email: user.email }).then(foundUser => {
        if (foundUser && foundUser.password === user.password) {
          request.cookieAuth.set({
            loggedIn: true,
            loggedInUser: user.email,
          });
          reply.redirect('/home');
        } else {
          reply.redirect('/signup');
        }
      }).catch(err => {
        reply.redirect('/');
      });
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
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.updateSettings = {

  validate: {

    options: {
      abortEarly: false,
    },

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('settings', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

  },
  handler: function (request, reply) {
    const editedUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.profilePicture = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    let profilePic = request.payload.picture;

    User.findOne({ email: userEmail }).then(user => {
      if (profilePic.length) {
        user.picture.data = profilePic;
        user.save();
      }

      reply.redirect('/settings');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.getProfilePicture = {
  handler: function (request, reply) {
    let userId = request.params.id;
    User.findOne({ _id: userId }).then(user => {
      reply(user.picture.data).type('image');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
