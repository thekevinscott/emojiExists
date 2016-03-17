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

describe('Getting number of emoji', function() {
  describe('Old emoji', function() {
    var emoji = '😀';
    it('should get 0 emoji for 0 emojis', function() {
      emojiExists.number('').should.equal(0);
    });

    it('should get 1 emoji for 1 emoji', function() {
      emojiExists.number(emoji).should.equal(1);
    });

    it('should get 2 emoji for 2 emojis', function() {
      emojiExists.number(emoji + emoji).should.equal(2);
    });
  });

  describe('New emoji', function() {
    var emoji = '🌮';

    it('should get 1 emoji for 1 emoji', function() {
      emojiExists.number(emoji).should.equal(1);
    });

    it('should get 2 emoji for 2 emojis', function() {
      emojiExists.number(emoji + emoji).should.equal(2);
    });

    it('should get 3 pizza', function() {
      emojiExists.number('🍕🍕🍕').should.equal(3);
    });
  });

  describe('Skin color', function() {
    var emoji = '👍🏿';

    it('should get 1 emoji for 1 emojis', function() {
      emojiExists.number(emoji).should.equal(1);
    });
  });
});
