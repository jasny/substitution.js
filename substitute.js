/**
 * Replace placeholders in a string, possibly through a callback.
 *
 * @license MIT
 * @copyright 2015 LegalThings
 * @author Arnold Daniels <arnold@jasny.net>
 */

function substitute(original, replacements, callback) {
  var copy = deepcopy(original);
  var errors = [];

  function hasKey(vars, key) {
    for (var name in vars) {
      if (!vars.hasOwnProperty(name)) continue;
      if (vars[name].match('{' + key + '}')) return true;
    }
    
    return false;
  }

  function applyKey(vars, key, value) {
    for (var name in vars) {
      if (!vars.hasOwnProperty(name)) continue;
      vars[name] = vars[name].replace('{' + key + '}', value);
    }
  }
  
  function isEmpty(vars) {
    for (var key in vars) {
      if (vars.hasOwnProperty(key)) return false;
    }
    return true;
  }

  // Main
  for (var key in replacements) {
    if (!replacements.hasOwnProperty(key)) continue;
          
    if (typeof replacements[key] === 'function') {
      if (!hasKey(copy, key)) {
        delete replacements[key];
        continue;        
      }
      
      replacements[key](function(err, value) {
        if (err) errors.push(err);
        applyKey(copy, key, value || '');
        
        delete replacements[key];
        
        if (isEmpty(replacements)) {
          var ret = typeof copy._value !== 'undefined' ? copy._value : copy;          
          callback(errors.length ? errors : null, ret);
        }
      });
    } else {
      applyKey(copy, key, replacements[key]);
      delete replacements[key];
    }
  }
  
  if (isEmpty(replacements)) {
    var ret = typeof copy._value !== 'undefined' ? copy._value : copy;
    callback(null, ret);
  }
}

// Support for AMD and CommonJS
(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
}('mod', function() {
    return substitute;
}));

