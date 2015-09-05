AdWords Scripts Collection
===============

Here you'll find a collection of my AdWords Scripts. Updated regularly - kinda.


### Scripts/Labels/AutoLabels.js

Adds labels to all your campaigns based on it's name and a separator. Solved a question over at the [adwords scripts google group](https://groups.google.com/forum/#!topic/adwords-scripts/yFcXYlH2mV8).


### Scripts/Reports/SearchVolume.js
Total Search Volume for your Exact Match Keywords. The total search volume is based on your ```impressions / impression share``` - (e.g. 1000/0.25). Make sure to add your email in ```var email '';``` edit other config variables as desired.

```javascript
// Enter your email address
var email = 'your@email.com'; 

// Style your report with a logo
var logo_img_url = 'http://example.com/example_logo.jpg';

// Where should your logo link to?
var logo_href_url = 'http://example.com/';

var impressionThreshold = 100;
var date = 'LAST_30_DAYS';
```


### Lib/PushCo.js

** OUT OF DATE - Pusch.co seems to be down **

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