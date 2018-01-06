'use srict'

const User = require('../models/user');
const Tweet = require('../models/tweet');
const Boom = require('boom');
const utils = require('./utils.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.find = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    User.find({}).exec().then(users => {
      reply(users);
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
    User.findOne({ _id: request.params.id }).then(user => {
      if (user != null) {
        reply(user);
      } else {
        reply(Boom.notFound('id not found'));
      }
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};
/*
exports.create = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.save().then(newUser => {
      reply(newUser).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating User'));
    });
  },
};*/

//Hashed create
exports.create = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    const user = new User(request.payload);
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;
      user.save().then(newUser => {
        reply(newUser).code(201);
      }).catch(err => {
        reply(Boom.badImplementation('error creating User'));
      });
    });
  },
};

exports.deleteOne = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
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
    User.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('Error removing users'));
    });
  },
};
/*
exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token, user: foundUser }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },
};*/

//Hashed authenticate
exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
        if (isValid) {
          reply(foundUser).code(201);
        } else {
          reply.code(204);
        }
      }).catch(err => {
        reply(Boom.notFound('internal db failure'));
      });
    });
  },
};

exports.follow = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    let userId = request.params.id;
    let followId = request.payload;
    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: followId }).then(followUser => {
        user.following.push(followUser._id);
        followUser.followers.push(user._id);
        followUser.save();
        user.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error following user'));
    });
  },
};

exports.unfollow = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    let userId = request.params.id;
    const unFollowId = request.payload;
    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: unFollowId }).then(unfollowUser => {
        user.following.remove(unFollowId);
        unfollowUser.followers.remove(userId);
        unfollowUser.save();
        user.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error unfollowing user'));
    });
  },
};

exports.followingTimeline = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    let userId = request.params.id;

    User.findOne({ _id: userId }).then(user => {
      User.findOne({ _id: user.following }).then(followUser => {
        Tweet.find({ tweeter: followUser }).exec().then(tweets => {
          reply(tweets).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error retrieving tweets'));
    });
  },
};
