const Tweet = require('../models/tweet');
const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

exports.find = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    Tweet.find({}).exec().then(tweets => {
      reply(tweets);
    }).catch(err => {
      reply(Boom.badImplementation('Error accessing db'));
    });
  },
};

exports.findOne = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    Tweet.findOne({ _id: request.params.id }).then(tweet => {
      if (tweet != null) {
        reply(tweet);
      } else {
        reply(Boom.notFound('id not found'));
      }
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.create = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating tweet'));
    });
  },
};

exports.deleteOne = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteAll = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('Error removing tweets'));
    });
  },
};

exports.myTweets = {

  auth: false,
  // auth: {
  //   strategy: jwt,
  // },

  handler: function (request, reply) {
    User.findOne({ _id: request.params.id }).then(user => {
      Tweet.find({ tweeter: user }).exec().then(tweets => {
        user.userTweets.push(tweets);
        user.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error retrieving user tweets'));
    });
  },
};
