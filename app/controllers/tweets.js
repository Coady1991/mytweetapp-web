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
    let data = request.payload;
    const tweeterEmail = request.auth.credentials.loggedInUser;
    data.tweeter = this.users[tweeterEmail];
    this.tweets.push(data);
    reply.redirect('/timeline');
  },
};
