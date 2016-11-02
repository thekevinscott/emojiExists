'use strict';
const emojiTree = require('emoji-tree');
module.exports = function emojiExists(str) {
  if (str === '') {
    return true;
  }

  const parsed = emojiTree(str);

  for (var i = 0; i < parsed.length; i++) {
    if (parsed[i].type !== 'emoji') {
      return false;
    }
  }

  return true;
};

module.exports.number = function number(str) {
  return emojiTree(str).filter(chr => chr.type === 'emoji').length;
};
