'use strict';

exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'Tweet a MyTweet' });
  },
};

exports.timeline = {
  handler: (request, reply) => {
    reply.view('timeline', { title: 'View MyTweets' });
  },
};

exports.tweet = {
  handler: (request, reply) => {
    reply.redirect('/timeline');
  },
};
