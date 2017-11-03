'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: (request, reply) => {
    reply.view('home', { title: 'Tweet a MyTweet' });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').then(allTweets => {
      reply.view('timeline', {
        title: 'MyTweets',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.usertimeline = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      Tweet.find({ tweeter: user.id }).populate('tweeter').then(allTweets => {
        reply.view('usertimeline', {
          title: 'My Tweets',
          tweets: allTweets,
        });
      }).catch(err => {
        console.log(err);
        reply.redirect('/');
      });
    });
  },
};

exports.tweet = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      const tweet = new Tweet(data);
      tweet.tweeter = user._id;
      return tweet.save();
    }).then(newTweet => {
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.deletetweet = {
  handler: function (request, reply) {
    const tweetId = request.params.id;
    Tweet.findOneAndRemove({ _id: tweetId }).then(success => {
      reply.redirect('/usertimeline');
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};
