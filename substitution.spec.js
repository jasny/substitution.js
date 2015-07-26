var substitute = require('./substitution');

describe('substitute', function() {
  describe('a single placeholder', function () {
    it('works for a string', function (done) {
      var subject = '{foo} zoo';
      
      substitute(subject, {foo: 'crazy'}, function(err, value) {
        if (!err) expect(value).toEqual('crazy zoo');
        done(err);
      });
    });
    
    it('works for an array', function (done) {
      var subject = [
        '{foo} zoo',
        'cool foo',
        'not so {foo} anymore'
      ];
      
      substitute(subject, {foo: 'crazy'}, function(err, value) {
        if (!err) expect(value).toEqual([
          'crazy zoo',
          'cool foo',
          'not so crazy anymore'
        ]);
        done(err);
      });
    });
    
    it('works for an object', function (done) {
      var subject = {
        a: '{foo} zoo',
        b: 'cool foo',
        c: 'not so {foo} anymore'
      };
      
      substitute(subject, {foo: 'crazy'}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo',
          b: 'cool foo',
          c: 'not so crazy anymore'
        });
        done(err);
      });
    });
    
    it('works for a complex structure', function (done) {
      var subject = {
        a: '{foo} zoo',
        b: 'cool foo',
        c: 'not so {foo} anymore',
        d: [
          'earth',
          '{foo} wind',
          'fire {foo}'
        ]
      };
      
      substitute(subject, {foo: 'crazy'}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo',
          b: 'cool foo',
          c: 'not so crazy anymore',
          d: [
            'earth',
            'crazy wind',
            'fire crazy'
          ]
        });
        done(err);
      });
    });
  });
  
  describe('multiple placeholders', function () {    
    it('works for a string as subject', function (done) {
      substitute('{foo} zoo {bar}', {foo: 'crazy', bar: 'life'}, function(err, value) {
        if (!err) expect(value).toEqual('crazy zoo life');
        done(err);
      });
    });
    
    it('works for an array', function (done) {
      var subject = [
        '{foo} zoo {bar}',
        'cool foo',
        'not so {foo} anymore'
      ];
      
      substitute(subject, {foo: 'crazy', bar: 'life'}, function(err, value) {
        if (!err) expect(value).toEqual([
          'crazy zoo life',
          'cool foo',
          'not so crazy anymore'
        ]);
        done(err);
      });
    });
    
    it('works for an object', function (done) {
      var subject = {
        a: '{foo} zoo {bar}',
        b: 'cool foo',
        c: 'not so {foo} anymore'
      };
      
      substitute(subject, {foo: 'crazy', bar: 'life'}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo life',
          b: 'cool foo',
          c: 'not so crazy anymore'
        });
        done(err);
      });
    });
    
    it('works for a complex structure', function (done) {
      var subject = {
        a: '{foo} zoo {bar}',
        b: 'cool foo',
        c: 'not so {foo} anymore',
        d: [
          'earth',
          '{foo} wind',
          'fire {bar}'
        ]
      };
      
      substitute(subject, {foo: 'crazy', bar: 'life'}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo life',
          b: 'cool foo',
          c: 'not so crazy anymore',
          d: [
            'earth',
            'crazy wind',
            'fire life'
          ]
        });
        done(err);
      });
    });
  });
  
  describe('a placeholder using a callback', function () {
    var fn = function(callback) {
      callback(null, 'crazy');
    };
  
    it('works for a string', function (done) {
      var subject = '{foo} zoo';
      
      substitute(subject, {foo: fn}, function(err, value) {
        if (!err) expect(value).toEqual('crazy zoo');
        done(err);
      });
    });
    
    it('works for an array', function (done) {
      var subject = [
        '{foo} zoo',
        'cool foo',
        'not so {foo} anymore'
      ];
      
      substitute(subject, {foo: fn}, function(err, value) {
        if (!err) expect(value).toEqual([
          'crazy zoo',
          'cool foo',
          'not so crazy anymore'
        ]);
        done(err);
      });
    });
    
    it('works for an object', function (done) {
      var subject = {
        a: '{foo} zoo',
        b: 'cool foo',
        c: 'not so {foo} anymore'
      };
      
      substitute(subject, {foo: fn}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo',
          b: 'cool foo',
          c: 'not so crazy anymore'
        });
        done(err);
      });
    });

    it('works for an object with undefined', function (done) {
      var subject = {
        x: undefined,
        a: '{foo} zoo',
        b: 'cool foo',
        c: 'not so {foo} anymore'
      };
      
      substitute(subject, {foo: fn}, function(err, value) {
        if (!err) expect(value).toEqual({
          x: undefined,
          a: 'crazy zoo',
          b: 'cool foo',
          c: 'not so crazy anymore'
        });
        done(err);
      });
    });
    
    it('works for a complex structure', function (done) {
      var subject = {
        a: '{foo} zoo',
        b: 'cool foo',
        c: 'not so {foo} anymore',
        d: [
          'earth',
          '{foo} wind',
          'fire {foo}'
        ]
      };
      
      substitute(subject, {foo: fn}, function(err, value) {
        if (!err) expect(value).toEqual({
          a: 'crazy zoo',
          b: 'cool foo',
          c: 'not so crazy anymore',
          d: [
            'earth',
            'crazy wind',
            'fire crazy'
          ]
        });
        done(err);
      });
    });
  });
  
  describe('using a callback with an error', function () {
    var foo = function(callback) {
      callback(null, 'crazy');
    };
    var bar = function(callback) {
      callback('bar is closed');
    };
    var zoo = function(callback) {
      callback('monkey error');
    };
    
    it('works with a single error', function (done) {
      substitute('{bar}', {bar: bar}, function(err, value) {
        expect(err, ['bar is closed']);
        expect(value, '{bar}');
        done();
      });
    });
    
    it('works with multiple errors and a success', function (done) {
      substitute('{foo} {bar} {zoo}', {foo: foo, bar: bar, zoo: zoo}, function(err, value) {
        expect(err, ['bar is closed', 'monkey error']);
        expect(value, 'crazy {bar} {zoo}');
        done();
      });
    });
  });
});

