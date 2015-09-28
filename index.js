'use strict';
var EmojiData = require('emoji-data');
module.exports = function(emoji) {
  if (emoji === '') {
    return true;
  }
  return false;
};
