'use strict';

const Tweet = require('../models/tweet');

exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'Tweet a MyTweet' });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    Tweet.find({}).exec().then(allTweets => {
      reply.view('timeline', {
        title: 'MyTweets',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.tweet = {
  handler: function (request, reply) {
    let data = request.payload;
    const tweet = new Tweet(data);
    tweet.save().then(newTweet => {
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
