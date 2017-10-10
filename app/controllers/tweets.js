'use strict';

exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'Tweet a MyTweet' });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    reply.view('timeline', {
      title: 'MyTweets',
      tweets: this.tweets,
    });
  },
};

exports.tweet = {
  handler: function (request, reply) {
    const data = request.payload;
    this.tweets.push(data);
    reply.redirect('/timeline');
  },
};
