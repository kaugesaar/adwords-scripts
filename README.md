AdWords Scripts Collection
===============

Here you'll find a collection of my AdWords Scripts. Updated regularly.

### lib/pushco.js

A simple library to start using Push.co API. With this you'll be able to send push notifications to your iPhone.

Example:

```javascript
var key = ''; // API Key
var secret = ''; // API Secret 
var pushco = new PushCo(key,secret);

// Send a text notification
pushco.sendPushMessage('Your message! Up to 140 characters including whitespace.');

// Send a url notification
pushco.sendPushUrl('Your message! Up to 140 characters including whitespace.", "http://goo.gl/Yl9BsJ');
```


## License

```
The MIT License (MIT)

Copyright (c) 2014 Victor Kaugesaar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```