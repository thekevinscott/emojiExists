# emojiExists

This is a function that checks to see whether a string contains *all* emoji or not.

```
var emojiExists = require('emojiExists');

emojiExists('foo');
>> false

emojiExists('foo😀');
>> false

emojiExists('😀');
>> true 
