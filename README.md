# emojiExists

This is a function that checks to see whether a string contains *only* emoji or not.

## Installing

*NPM*
```
npm install emoji-exists
```

## Using

*From Node*

```
var emojiExists = require('emoji-exists');

emojiExists('foo');
>> false

emojiExists('foo😀');
>> false

emojiExists('😀');
>> true

emojiExists('😀🎉');
>> true
```
