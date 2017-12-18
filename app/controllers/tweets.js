'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');

exports.home = {
  handler: (request, reply) => {
    var userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('home', { title: 'Tweet a MyTweet', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
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
      Tweet.find({ tweeter: user.id }).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
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
      let date = new Date();
      tweet.date = date.toLocaleString();
      console.log(tweet.date);
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
      console.log('Tweet successfully deleted');
      reply.redirect('/usertimeline');
    }).catch(err => {
      console.log('Error deleting tweet');
      reply.redirect('/home');
    });
  },
};

exports.deletealltweets = {
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(user => {
      Tweet.remove({ tweeter: user.id }).then(success => {
        console.log('All tweets successfully deleted');
        reply.redirect('/usertimeline');
      }).catch(err => {
        console.log('Error deleting all tweets');
        reply.redirect('/home');
      });
    });
  },
};
