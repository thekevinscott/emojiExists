'use strict';
require('chai').should();
var EmojiData = require('emoji-data');
var emojiExists = require('../index');

describe('Parsing emoji', function() {
  it('should allow a blank string', function() {
    emojiExists('').should.equal(true);
  });

  it('should reject text', function() {
    emojiExists('foo').should.equal(false);
  });

  it('should reject a mixed string', function() {
    emojiExists('😀foo😀').should.equal(false);
  });

  it('should reject a mixed string with emoji inside', function() {
    emojiExists('foo😀bar').should.equal(false);
  });

  it('should reject a mixed string with emoji at end', function() {
    emojiExists('foo😀').should.equal(false);
  });

  describe('Valid emoji', function() {
    // this is a list of phrases known to give trouble
    var troublePhrases = [

      /*
      '😀',
      '😀😀',
      '😀😀😀',
      '💩',

      // good hourglass
      '⌛',
      // bad hourglass,
      '⌛️',

      '⏳',
      '⏳⌛️',
      '⏳⌛️🔙',
      '⌛️',
      '🇨🇳',
      '🀄',

      '©',
      '®',
      '8️⃣',
      '🗣',
      '🌮'
      */

    ];

    EmojiData.all().map(function(emoji) {
      it('should check phrase: '+emoji, function() {
        var unified = EmojiData.unified_to_char(emoji.unified);
        //console.log('code point: ', unified, unified.codePointAt(0));
        try {
          emojiExists(unified).should.equal(true);
        } catch(e) {
          console.log('emoji failed:', unified);
          throw e;
        }
      });
    });

    troublePhrases.map(function(emoji) {
      it('should check phrase: '+emoji, function() {
        emojiExists(emoji).should.equal(true);
      });
    });

  });
});
