var substitute = require('./substitute');

describe('substitute()', function() {
  describe('substitute a single placeholder', function () {
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
  
  describe('substitute multiple placeholders', function () {    
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
  
  describe('substitute a placeholder using a callback', function () {
    var fn = function(callback) {
      callback(null, 'crazy');
    }
  
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
});

