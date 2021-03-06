# substitution.js
[![Build Status](https://travis-ci.org/jasny/substitution.js.svg?branch=master)](https://travis-ci.org/jasny/substitution.js)

JavaScript library to recursively substitute placeholders, possibly through a callback.

The library is intended for substituting placeholders in small strings. It will recursively replace all strings in an
object or array. When a callback is provided as replacement, it will only be called if the placeholder is used.

Works in node.js or in the browser (optional AMD support).


## Installation

#### npm

    npm install substitution --save
   
#### bower

    bower install substitution --save
    
   
## Usage

```js
var substitute = require('substitution'); // Node.js / AMD

var rawObject = {
  link: 'http://{domain}',
  dir: '{path}/bar',
  list: [
    'Go to {domain}',
    'Found on {path}'
  ]
};

var replacements = {
  path: 'www/assets',
  url: function(callback) {
    fs.readFile('domain.txt', 'utf-8', function(err, url) {
      callback(err, url);
    })
  }
};

substitute(rawObject, replacements, function(err, myObject) {
  // Use myObject
});
```

