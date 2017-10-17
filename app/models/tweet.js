'use strict';

const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  tweet: String,
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
