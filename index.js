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

var possible_codepoints_length = 3;

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
 * string and returns an array containing
 * each text element
 */
function nonEmojiExists(str) {
  var symbols = splitString(str);
  // for an index n within symbols,
  // check if [n, n+1, n+2] exists in the codepoints
  // array. if so, remove those three elements from symbols
  // and proceed.
  // otherwise, check if [n, n+1] exists in codepoints.
  // if so, remove those two elements from symbols and proceed.
  // else, check if [n] exists in the codepoints.
  // if so, remove the element n from symbols and proceed.
  // else, return false.
  while(symbols.length) {
    if (emojiMarks.indexOf(symbols.slice(0,3).join('-')) !== -1) {
      symbols.splice(0, 3);
    } else if (emojiMarks.indexOf(symbols.slice(0,2).join('-')) !== -1) {
      symbols.splice(0, 2);
    } else if (emojiMarks.indexOf(symbols.slice(0,1).join('-')) !== -1) {
      symbols.splice(0, 1);
    } else {
      return false;
    }
  }
  return true;
}
