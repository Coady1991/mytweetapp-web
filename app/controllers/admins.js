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
