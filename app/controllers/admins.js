'use strict'

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');

exports.adminhome = {
  handler: function (request, reply) {
    User.find({}).populate('user').then(allUsers => {
      reply.view('adminhome', {
        title: 'Admin Home',
        users: allUsers,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.adminadduser = {
  handler: function (request, reply) {
    reply.view('adminadduser', {
      title: 'Admin Add New User',
    });
  },
};

exports.adminnewuser = {
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
      reply.view('adminadduser', {
        title: 'Add new user error',
        errors: error.data.details,
      }).code(400);
    },
  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      console.log('New User added');
      reply.redirect('/adminhome');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.admindeleteuser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.remove({ tweeter: userId }).then(removeTweetSuccess => {
      console.log('User Tweets removed:', userId);
      return User.findByIdAndRemove({ _id: userId });
    }).then(removeUserSuccess => {
      console.log('User removed:', userId);
      reply.redirect('/adminhome');
    }).catch(err => {
      reply.redirect('/adminhome');
    });
  },
};

exports.admindeletetweet = {
  handler: function (request, reply) {
    const tweetId = request.params.id;
    Tweet.findOneAndRemove({ _id: tweetId }).then(success => {
      console.log('Tweet successfuly deleted');
      reply.redirect('/adminhome');
    }).catch(err => {
      console.log('Error deleting tweet');
      reply.redirect('/adminhome');
    });
  },
};

exports.admindeletealltweets = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.remove({ tweeter: userId }).then(success => {
      console.log('All tweets successfuly deleted');
      reply.redirect('/adminhome');
    }).catch(err => {
      console.log('Error deleting all tweets');
      reply.redirect('/adminhome');
    });
  },
};

exports.adminviewuser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.find({ tweeter: userId }).populate('tweeter').sort({ date: 'desc' }).then(userTweets => {
      reply.view('adminviewuser', {
        title: 'Tweets by user',
        id: userId,
        tweets: userTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
