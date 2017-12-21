'use strict'

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    const plaintextPassword = user.password;

    bcrypt.hash(plaintextPassword, saltRounds, function (err, hash) {
      user.password = hash;
      return user.save().then(newUser => {
        reply.redirect('/login');
      }).catch(err => {
        reply.redirect('/');
      });
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
        bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
          if (isValid) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: user.email,
            });
            reply.redirect('/home');
          } else {
            reply.redirect('/signup');
          }
        });
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
      password: Joi,
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
      bcrypt.hash(editedUser.password, saltRounds, function (err, hash) {
        user.password = hash;
        user.save();
      });

      return user;
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

exports.otherUsers = {
  handler: function (request, reply) {
    User.find({}).populate('user').then(allUsers => {
      reply.view('otherusers', {
        title: 'MyTweet Users',
        users: allUsers,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.viewOtherUser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    User.findOne({ _id: userId }).then(user => {
      Tweet.find({ tweeter: userId }).populate('tweeter').sort({ date: 'desc' }).then(userTweets => {
        reply.view('userviewuser', {
          title: 'Tweets by user',
          user: user,
          id: userId,
          tweets: userTweets,
        });
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.follow = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    let userId = request.params.id;
    User.findOne({ email: userEmail }).then(user => {
      User.findOne({ _id: userId }).then(followUser => {
        user.following.push(followUser._id);
        followUser.followers.push(user._id);
        user.save();
        followUser.save();
        reply.redirect('/timeline');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.unfollow = {
  handler: function (request, reply) {
    let loggedInUser = request.auth.credentials.loggedInUser;
    const userId = request.params.id;
    User.findOne({ email: loggedInUser }).then(user => {
      User.findOne({ _id: userId }).then(unfollowUser => {
        user.following.splice(unfollowUser._id, 1);
        unfollowUser.followers.splice(user._id, 1);
        user.save();
        unfollowUser.save();
        reply.redirect('/timeline');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

/* Unhashed register, authenticate and updateSettings
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
}; */
