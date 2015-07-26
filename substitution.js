/**
 * Replace placeholders in a string, possibly through a callback.
 *
 * @license MIT
 * @copyright 2015 LegalThings
 * @author Arnold Daniels <arnold@jasny.net>
 */

/**
 * export to AMD/CommonJS/global.
 *
 * @param {Object}   global   global object.
 * @param {Function} factory  factory method.
 */
(function(global, factory) {
  'use strict';

  if (typeof define === 'function' && !!define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    global.substitute = factory();
  }
}(this, function() {
  if (typeof exports === 'object') var deepcopy = require('deepcopy');
  
  if (typeof deepcopy !== 'function') {
    throw "deepcopy not available";
  }

  /**
   * Substitute all placeholders in subject recursively
   *
   * @param            subject       The object or string with placeholders.
   * @param {String}   replacements  Key / value pairs.
   * @param {Function} callback
   */
  function substitute(subject, replacements, callback) {
    var copy = {_: deepcopy(subject)};
    var errors = [];

    for (var placeholder in replacements) {
      if (!replacements.hasOwnProperty(placeholder)) continue;
      
      if (typeof replacements[placeholder] === 'function') {
        if (!hasPlaceholder(copy, placeholder)) {
          delete replacements[placeholder];
          continue;        
        }
        
        replacements[placeholder](function(err, value) {
          if (err) errors.push(err);
          substitutePlaceholder(copy, placeholder, value || '');
          
          delete replacements[placeholder];
          
          if (isEmpty(replacements)) callback(errors.length ? errors : null, copy._);
        });
      } else {
        substitutePlaceholder(copy, placeholder, replacements[placeholder]);
        delete replacements[placeholder];
      }
    }
    
    if (isEmpty(replacements)) callback(null, copy._);
  }

  /**
   * Check if subject has a placeholder.
   * Does breadth first traversal.
   *
   * @param          subject      The object or string with placeholders.
   * @param {String} placeholder  The placeholder key.
   * @return {Boolean}
   */
  function hasPlaceholder(subject, placeholder) {
    var queue = [],
        next = subject;
    
    while (typeof next !== 'undefined') {
      if (typeof next === 'string') {
        if (next.match(placeholder)) return true; // Found
      } else if (Object.prototype.toString.call(next) === '[object Array]') {
        for (var i = 0; i < next.length; i++) {
          queue.push(next[i]);
        }
      } else if (typeof next === 'object') { 
        for (var key in next) {
          if (!next.hasOwnProperty(key) || typeof next[key] === 'undefined') continue;
          queue.push(next[key]);
        }
      }
        
      next = queue.shift();
    }
    
    return false;
  }

  /**
   * Recursively substitute a placeholder.
   *
   * @param          subject      The object or string with placeholders.
   * @param {String} placeholder  The placeholder key.
   * @param {String} value        The substitution value.
   * @return subject
   */
  function substitutePlaceholder(subject, placeholder, value) {
    if (Object.prototype.toString.call(subject) === '[object Array]') {
      for (var i = 0; i < subject.length; i++) {
        subject[i] = substitutePlaceholder(subject[i], placeholder, value);
      }
    } else if (typeof subject === 'object') {
      for (var key in subject) {
        if (!subject.hasOwnProperty(key)) continue;
        subject[key] = substitutePlaceholder(subject[key], placeholder, value);
      }
    } else if (typeof subject === 'string') {
      subject = subject.replace('{' + placeholder + '}', value);
    }
    
    return subject;
  }
  
  /**
   * Check if object is empty
   *
   * @param {Object} object
   * @return {Boolean}
   */
  function isEmpty(object) {
    for (var placeholder in object) {
      if (object.hasOwnProperty(placeholder)) return false;
    }
    return true;
  }

  return substitute;
}));

