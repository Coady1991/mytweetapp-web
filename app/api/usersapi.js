'use srict'

const User = require('../models/user');
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
};

/*Hashed authenticate
exports.authenticate = {

  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      bcrypt.compare(user.password, foundUser.password, function (err, isValid) {
        if (isValid) {
          const token = utils.createToken(foundUser);
          reply({ success: true, token: token, user: foundUser }).code(201);
        } else {
          reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
        }
      }).catch(err => {
        reply(Boom.notFound('internal db failure'));
      });
    });
  },
}; */

exports.follow = {

  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },

  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    let userId = request.params.id;
    User.findOne({ email: userEmail }).then(user => {
      User.findOne({ _id: userId }).then(followUser => {
        user.following.push(followUser._id);
        followUser.followers.push(user._id);
        user.save();
        followUser.save().then(User => {
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
    let loggedInUser = request.auth.credentials.loggedInUser;
    const userId = request.params.id;
    User.findOne({ email: loggedInUser }).then(user => {
      User.findOne({ _id: userId }).then(unfollowUser => {
        user.following.splice(unfollowUser._id, 1);
        unfollowUser.followers.splice(user._id, 1);
        user.save();
        unfollowUser.save().then(User => {
          reply(User).code(201);
        });
      });
    }).catch(err => {
      reply(Boom.badImplementation('Error unfollowing user'));
    });
  },
};
