'use strict';
var EmojiData = require('emoji-data');
var punycode = require('punycode');

var emojiMarks = EmojiData.codepoints({
  include_variants: true
});

module.exports = function(str) {
  if (str === '') {
    return true;
  }
  return nonEmojiExists(str);
};

var possible_surrogate_length = 3;

/*
 * This function should take an incoming
 * string and split it into hex values
 * representing each symbol or text
 */
function splitString(str) {
  return punycode.ucs2.decode(str).map(function(symbol) {
    return pad(symbol.toString(16).toUpperCase());
  });
}

/*
 * adds leading zeros
 */
function pad(str) {
  while (str.length < 4) {
    str = '0' + str;
  }
  return str;
}

/* This function takes an incoming
 * string and returns a boolean indicating
 * whether the string consists entirely of
 * emojis or not
 */
function nonEmojiExists(str) {
  var symbols = splitString(str);
  while(symbols.length) {
    var surrogateLength = getSurrogateLength(symbols);
    if (surrogateLength) {
      symbols.splice(0, surrogateLength);
    } else {
      return false;
    }
  }
  return true;
}

function checkEmoji(pairs) {
  return emojiMarks.indexOf(pairs.join('-')) !== -1;
}

function getSurrogateLength(symbols) {
  for (var i=0; i<possible_surrogate_length; i++) {
    var len = possible_surrogate_length-i;
    if (checkEmoji(symbols.slice(0,len))) {
      return len;
    }
  }
  return false;
}
