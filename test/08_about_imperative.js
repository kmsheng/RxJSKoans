var Rx = require('rx'),
    Observable = Rx.Observable;

QUnit.module('Imperative');

var __ = 'Fill in the blank';

test('can make a decision with an if with no else', function () {
  var results = [];
  Observable.range(1, 10)
    .flatMap(function (x) {
      return Rx.Observable.if(
        function () { return x % 2 === 0; },
        Observable.just(x)
      );
    })
    .subscribe(results.push.bind(results));

  equal('246810', results.join(''));
});

test('can make a decision with an if with an else', function () {
  var results = [];
  Observable.range(1, 5)
    .flatMap(function (x, i) {
      return Rx.Observable.if(
        function () { return x % 2 === 0; },
        Observable.just(x),
        Observable.range(x, i)
      );
    })
    .subscribe(results.push.bind(results));

  // x: 1 i: 0 ----> odd []
  // x: 2 i: 1 ----> even 2
  // x: 3 i: 2 ----> odd [3, 4]
  // x: 4 i: 3 ----> even 4
  // x: 5 i: 4 ----> odd [5, 6, 7, 8]

  equal('23445678', results.join(''));
});

test('we can make test cases', function () {
  var result = '';

  var cases = {
    'matt': Observable.just(1),
    'erik': Observable.just(2),
    'bart': Observable.just(3),
    'wes': Observable.just(4)
  };

  Observable.just('wes')
    .flatMap(function (x) {
      return Observable.case(
        function () { return x; },
        cases
      );
    })
    .subscribe(function (x) { result = x; });

  equal(4, result);
});

test('we can also have a default case', function () {
  var result = '';

  var cases = {
    'matt': Observable.just(1),
    'erik': Observable.just(2),
    'bart': Observable.just(3),
    'wes': Observable.just(4)
  };

  Observable.just('RxJS')
    .flatMap(function (x) {
      return Observable.case(
        function () { return x; },
        cases,
        Observable.just(__)
      );
    })
    .subscribe(function (x) { result = x; });

  equal(5, result);
});

test('while does something until proven false', function () {
  var i = 0;
  var result = [];

  var source = Rx.Observable
    .while(
      function () { return ++i < 3 },
      Rx.Observable.just(__)
    )
    .subscribe(result.push.bind(result));

  equal('4242', result.join(''));
});
