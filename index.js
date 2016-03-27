'use strict';
//var EmojiData = require('emoji-data');
var punycode = require('punycode');

//var emojiMarks = EmojiData.codepoints({
  //include_variants: true
//});

var possible_surrogate_length = 8;

var emojiMarks = require('./vendor/emoji.json').map(function(emoji) {
  //if (emoji.name === 'KEYCAP 8') {
  var codepoint = emoji.unified;
  var emojis = [codepoint];
  var surrogate_length = codepoint.split('-').length;
  if ( surrogate_length > possible_surrogate_length ) {
    possible_surrogate_length = surrogate_length;
  }

  return emojis.concat(emoji.variations);
  //}
}).filter(function(el) {
  return el;
}).reduce(function(arr, els) {
  return arr.concat(els);
}, []);


module.exports = function(str) {
  if (str === '') {
    return true;
  }
  return nonEmojiExists(str);
};

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
  var iterator = possible_surrogate_length;
  if ( symbols.length < possible_surrogate_length ) {
    iterator = symbols.length;
  }
  for (var i=0; i< iterator; i++) {
    var len = iterator-i;
    if (checkEmoji(symbols.slice(0,len))) {
      return len;
    }
  }
  return false;
}

function getEmojiArray(symbols) {
  var emojis = [];

  let found_emoji = false;
  for ( var i=0; i<symbols.length;i++) {
    if (checkEmoji(symbols.slice(symbols.length - 1 - i))) {
      found_emoji = true;
      const emoji_symbols = symbols.splice(symbols.length - 1 - i);
      emojis.push(emoji_symbols);
      break;
    }
  }

  if ( ! found_emoji ) {
    // invalid emoji
    symbols.pop();
  }

  if ( symbols.length ) {
    return getEmojiArray(symbols).concat(emojis);
  } else {
    return emojis;
  }
}

function number(str) {
  var symbols = splitString(str);
  return getEmojiArray(symbols).length;
};

module.exports.number = number;
