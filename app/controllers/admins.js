'use strict'

const User = require('../models/user');
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
      reply.redirect('/adminhome');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
